/**
 * chat.controller.ts — REST endpoints for chat
 *
 * GET  /api/chat/order/:orderId  — load message history (on chat window open)
 * POST /api/chat/upload          — upload files to Cloudinary, return metadata
 *
 * File upload flow:
 *   1. Frontend selects files → sends multipart/form-data POST to /upload
 *   2. Controller uploads each file to Cloudinary in parallel
 *   3. Returns array of { url, publicId, fileType, fileName, fileSize }
 *   4. Frontend emits 'send_message' via Socket.io with the returned metadata
 *   5. No file data travels through Socket.io — only the Cloudinary URLs
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AppError, ErrorCode } from '../../error';
import { uploadToCloudinary } from '../../common/middlewares/upload.middleware';
import cloudinary from '../../config/cloudinary';
import prisma from '../../config/prisma';

// ── GET /api/chat/order/:orderId ──────────────────────────────────────────────

export async function getChatHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orderId = String(req.params.orderId);
    const userId = String(req.user!.id);

    // Step 1: Verify user is a party in this order
    const orderAccess = await prisma.order.findUnique({
      where: { id: orderId },
      select: { clientId: true, freelancerId: true },
    });

    if (!orderAccess) {
      return next(new AppError('Order not found', 404, ErrorCode.NOT_FOUND));
    }

    if (orderAccess.clientId !== userId && orderAccess.freelancerId !== userId) {
      return next(new AppError('Access denied to this chat', 403, ErrorCode.FORBIDDEN));
    }

    // Step 2: Fetch the chat room with messages using raw query result
    // (Prisma v7 with driver-adapter can have include type inference quirks)
    const chatRoomRaw = await prisma.chatRoom.findUnique({
      where: { orderId },
    });

    if (!chatRoomRaw) {
      return next(new AppError('Chat room not found for this order', 404, ErrorCode.NOT_FOUND));
    }

    // Fetch messages separately with full include to avoid type inference issues
    const messages = await prisma.message.findMany({
      where: { chatRoomId: chatRoomRaw.id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });

    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/chat/conversations ───────────────────────────────────────────────

export async function getConversations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = String(req.user!.id);

    // Fetch all orders where the user is either the client or freelancer
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

    // Map each order into a conversational card format
    const conversations = await Promise.all(
      orders.map(async (order) => {
        // Ensure chat room exists for the order
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

    // Sort conversations by most recent message/activity
    conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/chat/init ───────────────────────────────────────────────────────

export async function initChat(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = String(req.user!.id);
    const { orderId, freelancerId, gigId } = req.body as {
      orderId?: string;
      freelancerId?: string;
      gigId?: string;
    };

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          client: { select: { id: true, name: true, image: true } },
          freelancer: { select: { id: true, name: true, image: true } },
          chatRoom: true,
        },
      });

      if (!order) {
        return next(new AppError('Order not found', 404, ErrorCode.NOT_FOUND));
      }

      if (order.clientId !== userId && order.freelancerId !== userId) {
        return next(new AppError('Access denied', 403, ErrorCode.FORBIDDEN));
      }

      let chatRoom = order.chatRoom;
      if (!chatRoom) {
        chatRoom = await prisma.chatRoom.create({ data: { orderId: order.id } });
      }

      const isClient = order.clientId === userId;
      const otherUser = isClient ? order.freelancer : order.client;

      res.json({
        success: true,
        data: {
          orderId: order.id,
          chatRoomId: chatRoom.id,
          otherUser,
        },
      });
      return;
    }

    if (!freelancerId || !gigId) {
      return next(
        new AppError(
          'Provide either orderId or both freelancerId and gigId',
          400,
          ErrorCode.VALIDATION_ERROR,
        ),
      );
    }

    if (freelancerId === userId) {
      return next(
        new AppError('Cannot start a chat with yourself', 400, ErrorCode.VALIDATION_ERROR),
      );
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
        freelancer: { select: { id: true, name: true, image: true } },
      },
    });

    if (!existingOrder) {
      const gig = await prisma.gig.findUnique({ where: { id: gigId } });
      if (!gig) {
        return next(new AppError('Gig not found', 404, ErrorCode.NOT_FOUND));
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
          freelancer: { select: { id: true, name: true, image: true } },
        },
      });
    } else if (!existingOrder.chatRoom) {
      await prisma.chatRoom.create({ data: { orderId: existingOrder.id } });
    }

    res.json({
      success: true,
      data: {
        orderId: existingOrder.id,
        chatRoomId: existingOrder.chatRoom?.id,
        otherUser: existingOrder.freelancer,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/chat/upload ─────────────────────────────────────────────────────

export async function uploadChatFiles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return next(new AppError('No files provided', 400, ErrorCode.VALIDATION_ERROR));
    }

    // Upload all files to Cloudinary concurrently (parallel — faster than sequential)
    const uploadResults = await Promise.all(files.map((file) => uploadToCloudinary(file)));

    res.json({ success: true, data: uploadResults });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/chat/download ────────────────────────────────────────────────────
// Secure streaming download proxy for attachments (images, PDFs, CSVs, etc.)
// Prevents cross-origin download restrictions and forces proper Content-Disposition

export async function downloadChatAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const url = String(req.query.url ?? '');
    const fileName = String(req.query.fileName ?? '');
    let publicId = String(req.query.publicId ?? '');

    if (!url && !publicId) {
      return next(
        new AppError('Attachment URL or publicId is required', 400, ErrorCode.VALIDATION_ERROR),
      );
    }

    // SSRF Prevention: Only allow download requests to Cloudinary
    if (url) {
      try {
        const parsed = new URL(url);
        if (!parsed.hostname.endsWith('cloudinary.com')) {
          return next(new AppError('Forbidden attachment host', 403, ErrorCode.FORBIDDEN));
        }
      } catch {
        return next(new AppError('Invalid attachment URL', 400, ErrorCode.VALIDATION_ERROR));
      }
    }

    // Extract publicId from URL if not explicitly supplied
    if (!publicId && url.includes('/upload/')) {
      const parts = url.split('/upload/');
      if (parts[1]) {
        // Strip optional version prefix e.g. v1789733061/
        publicId = parts[1].replace(/^v\d+\//, '');
      }
    }

    const isRaw =
      url.includes('/raw/upload/') ||
      (!url.includes('/image/upload/') && !url.includes('/video/upload/'));

    // If it's a raw resource (PDF, CSV, documents), generate signed download URL to bypass Cloudinary restricted media 401
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

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
    );

    const streamResponse = await axios({
      method: 'GET',
      url: downloadSourceUrl,
      responseType: 'stream',
      timeout: 30000,
    });

    if (streamResponse.headers['content-type']) {
      res.setHeader('Content-Type', streamResponse.headers['content-type']);
    }
    if (streamResponse.headers['content-length']) {
      res.setHeader('Content-Length', streamResponse.headers['content-length']);
    }

    streamResponse.data.pipe(res);
  } catch (err: unknown) {
    console.error('[Chat] Download attachment error:', err);
    if (!res.headersSent) {
      next(new AppError('Failed to download attachment', 500, ErrorCode.INTERNAL_SERVER_ERROR));
    }
  }
}
