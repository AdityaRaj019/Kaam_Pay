/**
 * chat.consumer.ts — Kafka Consumer for chat messages and notifications
 *
 * This runs as a background process alongside the Express server.
 * Think of it as the "postal worker" that:
 *  1. Reads messages from the Kafka mailbox
 *  2. Saves them permanently to PostgreSQL
 *  3. Delivers them instantly to online users via Socket.io
 *  4. If the recipient is offline → saves as a DB notification (shown on next login)
 */

import { Server as SocketServer } from 'socket.io';
import { kafkaConsumer, KAFKA_TOPIC_CHAT, KAFKA_TOPIC_NOTIFICATIONS } from '../config/kafka';
import prisma from '../config/prisma';

// ── Types ────────────────────────────────────────────────────────────────────

interface AttachmentPayload {
  url: string;
  publicId: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

interface ChatMessagePayload {
  chatRoomId: string;
  orderId: string;
  senderId: string;
  recipientId: string; // the other party — needed for offline notification
  text?: string;
  attachments?: AttachmentPayload[];
}

interface NotificationPayload {
  userId: string;
  type: string;
  message: string;
}

// ── Main startup function ─────────────────────────────────────────────────────

/**
 * Call this once at server startup.
 * Connects to Kafka and begins processing messages indefinitely.
 */
export async function startChatConsumer(io: SocketServer): Promise<void> {
  await kafkaConsumer.connect();
  console.log('[Kafka Consumer] Connected ✅');

  await kafkaConsumer.subscribe({
    topics: [KAFKA_TOPIC_CHAT, KAFKA_TOPIC_NOTIFICATIONS],
    fromBeginning: false, // only process new messages, not old ones from the queue
  });

  await kafkaConsumer.run({
    /**
     * eachMessage is called once per Kafka message.
     * We never throw here — any error is caught and logged so the consumer keeps running.
     */
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString()) as Record<string, unknown>;

        if (topic === KAFKA_TOPIC_CHAT) {
          await handleChatMessage(io, payload as unknown as ChatMessagePayload);
        } else if (topic === KAFKA_TOPIC_NOTIFICATIONS) {
          await handleNotification(io, payload as unknown as NotificationPayload);
        }
      } catch (err) {
        // Log the error but do NOT re-throw — a throw here would crash the entire consumer
        console.error(`[Kafka Consumer] Failed to process message on topic "${topic}":`, err);
      }
    },
  });
}

// ── Chat message handler ──────────────────────────────────────────────────────

async function handleChatMessage(io: SocketServer, payload: ChatMessagePayload): Promise<void> {
  const { chatRoomId, orderId, senderId, recipientId, text, attachments } = payload;

  // 1. Persist the message to PostgreSQL
  const savedMessage = await prisma.message.create({
    data: {
      chatRoomId,
      senderId,
      text: text ?? null,
      // Create attachment rows linked to this message
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

  // 2. Broadcast to the order room — only the two parties are in this room
  const roomName = `order_${orderId}`;
  io.to(roomName).emit('receive_message', savedMessage);

  // 3. If recipient is NOT currently in the room → save as notification
  //    We check room membership via the Socket.io server adapter
  const socketsInRoom = await io.in(roomName).fetchSockets();
  const recipientIsOnline = socketsInRoom.some((s) => s.data.userId === recipientId);

  if (!recipientIsOnline) {
    const senderName = savedMessage.sender.name;
    const preview = text
      ? text.length > 50
        ? text.slice(0, 50) + '…'
        : text
      : `${attachments?.length ?? 1} file(s)`;

    // Save notification to DB (they'll see it when they log in)
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        message: `${senderName}: ${preview}`,
      },
    });
  }
}

// ── Notification handler ──────────────────────────────────────────────────────

async function handleNotification(io: SocketServer, payload: NotificationPayload): Promise<void> {
  const { userId, type, message } = payload;

  // 1. Save notification to DB first (persists for offline users)
  const notification = await prisma.notification.create({
    data: { userId, type, message },
  });

  // 2. Push to user's personal socket room — delivers as toast if they're online
  io.to(`user_${userId}`).emit('notification', notification);
}
