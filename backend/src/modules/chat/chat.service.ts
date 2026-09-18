/**
 * chat.service.ts — Service layer for the Chat module
 *
 * Encapsulates all chat domain logic:
 *  - Verification of order participant access
 *  - Message history and conversation thread loading
 *  - Conversation initiation (by order or gig inquiry)
 *  - Database persistence for incoming Kafka messages
 *  - Secure Cloudinary signed download preparation
 */

import prisma from '../../config/prisma';
import cloudinary from '../../config/cloudinary';
import { AppError, ErrorCode } from '../../error/AppError';
import type {
  ChatMessagePayload,
  InitChatInput,
  DownloadAttachmentQuery,
  ConversationCard,
} from './chat.types';

export class ChatService {
  /**
   * Verifies that the user is either the client or freelancer for an order,
   * and returns the order details, chat room, and counterparty ID.
   */
  static async verifyOrderParty(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: {
        chatRoom: true,
        client: { select: { id: true, name: true, image: true, email: true } },
        freelancer: { select: { id: true, name: true, image: true, email: true } },
      },
    });

    if (!order) {
      throw new AppError('Order not found or access denied', 404, ErrorCode.NOT_FOUND);
    }

    const recipientId = order.clientId === userId ? order.freelancerId : order.clientId;
    const otherUser = order.clientId === userId ? order.freelancer : order.client;

    return { order, chatRoom: order.chatRoom, recipientId, otherUser };
  }

  /**
   * Retrieves full message history with attachments for an order's chat room.
   */
  static async getChatHistory(orderId: string, userId: string) {
    const { order, chatRoom } = await this.verifyOrderParty(orderId, userId);

    if (!chatRoom) {
      // Ensure chat room exists if order is valid
      const newRoom = await prisma.chatRoom.create({ data: { orderId: order.id } });
      return { chatRoom: newRoom, messages: [] };
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId: chatRoom.id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });

    return { chatRoom, messages };
  }

  /**
   * Retrieves all conversation cards for a user, sorted by recent activity.
   */
  static async getConversations(userId: string): Promise<ConversationCard[]> {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: {
        client: { select: { id: true, name: true, image: true, email: true } },
        freelancer: { select: { id: true, name: true, image: true, email: true } },
        gig: { select: { id: true, title: true, price: true } },
        chatRoom: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: { select: { id: true, name: true } },
                attachments: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const conversations = await Promise.all(
      orders.map(async (order) => {
        let chatRoom = order.chatRoom;
        if (!chatRoom) {
          chatRoom = await prisma.chatRoom.create({
            data: { orderId: order.id },
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: {
                  sender: { select: { id: true, name: true } },
                  attachments: true,
                },
              },
            },
          });
        }

        const isClient = order.clientId === userId;
        const otherUser = isClient ? order.freelancer : order.client;
        const lastMessage = chatRoom.messages[0] ?? null;

        return {
          orderId: order.id,
          chatRoomId: chatRoom.id,
          orderStatus: order.status,
          gigTitle: order.gig?.title ?? 'Direct Order',
          gigPrice: order.amount,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            image: otherUser.image,
            email: otherUser.email,
            role: isClient ? 'FREELANCER' : 'CLIENT',
          },
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                text: lastMessage.text,
                senderId: lastMessage.senderId,
                senderName: lastMessage.sender.name,
                hasAttachments: lastMessage.attachments.length > 0,
                createdAt: lastMessage.createdAt,
              }
            : null,
          updatedAt: lastMessage?.createdAt ?? order.updatedAt,
        };
      }),
    );

    conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return conversations;
  }

  /**
   * Initializes or fetches a conversation by order ID or gig inquiry.
   */
  static async initChat(userId: string, input: InitChatInput) {
    if (input.orderId) {
      const { order, otherUser } = await this.verifyOrderParty(input.orderId, userId);

      let chatRoom = order.chatRoom;
      if (!chatRoom) {
        chatRoom = await prisma.chatRoom.create({ data: { orderId: order.id } });
      }

      return {
        orderId: order.id,
        chatRoomId: chatRoom.id,
        otherUser,
      };
    }

    const { freelancerId, gigId } = input;
    if (!freelancerId || !gigId) {
      throw new AppError(
        'Provide either orderId or both freelancerId and gigId',
        400,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    if (freelancerId === userId) {
      throw new AppError('Cannot start a chat with yourself', 400, ErrorCode.VALIDATION_ERROR);
    }

    // Check if an order already exists between this client and freelancer for this gig
    let existingOrder = await prisma.order.findFirst({
      where: {
        clientId: userId,
        freelancerId,
        gigId,
      },
      include: {
        chatRoom: true,
        freelancer: { select: { id: true, name: true, image: true, email: true } },
      },
    });

    if (!existingOrder) {
      const gig = await prisma.gig.findUnique({ where: { id: gigId } });
      if (!gig) {
        throw new AppError('Gig not found', 404, ErrorCode.NOT_FOUND);
      }

      existingOrder = await prisma.order.create({
        data: {
          clientId: userId,
          freelancerId,
          gigId,
          amount: gig.price,
          status: 'PENDING',
          chatRoom: {
            create: {},
          },
        },
        include: {
          chatRoom: true,
          freelancer: { select: { id: true, name: true, image: true, email: true } },
        },
      });
    } else if (!existingOrder.chatRoom) {
      const newRoom = await prisma.chatRoom.create({ data: { orderId: existingOrder.id } });
      existingOrder = { ...existingOrder, chatRoom: newRoom };
    }

    return {
      orderId: existingOrder.id,
      chatRoomId: existingOrder.chatRoom?.id,
      otherUser: existingOrder.freelancer,
    };
  }

  /**
   * Persists an incoming Kafka message and any associated file attachments to PostgreSQL.
   */
  static async saveIncomingMessage(payload: ChatMessagePayload) {
    const { chatRoomId, senderId, text, attachments } = payload;

    return prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        text: text ?? null,
        attachments: attachments?.length
          ? {
              create: attachments.map((a) => ({
                url: a.url,
                publicId: a.publicId,
                fileType: a.fileType,
                fileName: a.fileName,
                fileSize: a.fileSize,
              })),
            }
          : undefined,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });
  }

  /**
   * Validates attachment download parameters, enforces SSRF protection,
   * signs private download URLs for raw documents, and configures stream headers.
   */
  static prepareAttachmentDownload(query: DownloadAttachmentQuery) {
    const url = String(query.url ?? '');
    const fileName = String(query.fileName ?? '');
    let publicId = String(query.publicId ?? '');

    if (!url && !publicId) {
      throw new AppError('Attachment URL or publicId is required', 400, ErrorCode.VALIDATION_ERROR);
    }

    // SSRF Prevention: Only allow download requests to Cloudinary hosts
    if (url) {
      try {
        const parsed = new URL(url);
        if (!parsed.hostname.endsWith('cloudinary.com')) {
          throw new AppError('Forbidden attachment host', 403, ErrorCode.FORBIDDEN);
        }
      } catch (err: unknown) {
        if (err instanceof AppError) throw err;
        throw new AppError('Invalid attachment URL', 400, ErrorCode.VALIDATION_ERROR);
      }
    }

    // Extract publicId from URL if not explicitly supplied
    if (!publicId && url.includes('/upload/')) {
      const parts = url.split('/upload/');
      if (parts[1]) {
        publicId = parts[1].replace(/^v\d+\//, '');
      }
    }

    const isRaw =
      url.includes('/raw/upload/') ||
      (!url.includes('/image/upload/') && !url.includes('/video/upload/'));

    let downloadSourceUrl = url;
    if (isRaw && publicId) {
      downloadSourceUrl = cloudinary.utils.private_download_url(publicId, '', {
        resource_type: 'raw',
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });
    }

    const safeFileName = fileName.trim() || publicId.split('/').pop() || 'attachment';
    const encodedFileName = encodeURIComponent(safeFileName);

    return {
      downloadSourceUrl,
      safeFileName,
      encodedFileName,
    };
  }
}
