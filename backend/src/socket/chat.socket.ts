/**
 * chat.socket.ts — Socket.io server with Redis adapter
 *
 * This is the gateway of the real-time chat & notification system.
 * Manages:
 *  - User session authentication via Better Auth cookies
 *  - Chat room access control (verified via ChatService)
 *  - Message routing to Kafka
 *  - Real-time online presence & typing indicators
 */

import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis';
import { kafkaProducer, KAFKA_TOPIC_CHAT } from '../config/kafka';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { ChatService } from '../modules/chat/chat.service';
import { NotificationService } from '../modules/notifications/notification.service';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SocketData {
  userId: string;
  userName: string;
}

interface JoinRoomPayload {
  orderId: string;
}

interface SendMessagePayload {
  orderId: string;
  text?: string;
  attachments?: Array<{
    url: string;
    publicId: string;
    fileType: string;
    fileName: string;
    fileSize: number;
  }>;
}

interface TypingPayload {
  orderId: string;
  isTyping: boolean;
}

// ── Socket server initialization ──────────────────────────────────────────────

export async function initSocketServer(
  httpServer: HttpServer,
): Promise<SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>> {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',');

  const io = new SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(
    httpServer,
    {
      cors: {
        origin: allowedOrigins,
        credentials: true, // needed so the browser sends session cookies
      },
      transports: ['websocket', 'polling'],
    },
  );

  // Redis adapter for horizontal multi-instance scaling
  io.adapter(createAdapter(pubClient, subClient));
  console.log('[Socket.io] Redis adapter attached ✅');

  // ── Authentication middleware ───────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.request.headers as Record<string, string>),
      });

      if (!session?.user) {
        return next(new Error('Authentication failed: no valid session'));
      }

      socket.data.userId = session.user.id;
      socket.data.userName = session.user.name;
      next();
    } catch {
      next(new Error('Authentication failed'));
    }
  });

  // ── Connection handler ─────────────────────────────────────────────────────
  io.on('connection', async (socket) => {
    const { userId, userName } = socket.data;
    console.log(`[Socket] ${userName} (${userId}) connected — socket ${socket.id}`);

    // Join personal notification room immediately on connect
    await socket.join(`user_${userId}`);

    // Broadcast presence: "user came online"
    socket.broadcast.emit('user_online', { userId });

    // ── Event: join_room ─────────────────────────────────────────────────────
    socket.on('join_room', async (payload: JoinRoomPayload) => {
      const { orderId } = payload;

      try {
        // Access verification via ChatService
        const { chatRoom, recipientId: otherUserId } = await ChatService.verifyOrderParty(
          orderId,
          userId,
        );

        if (!chatRoom) {
          socket.emit('error', { message: 'Chat room not found or access denied' });
          return;
        }

        const roomName = `order_${orderId}`;
        await socket.join(roomName);

        // Check if counterparty has active sockets in user_{otherUserId}
        const otherUserSockets = await io.in(`user_${otherUserId}`).fetchSockets();
        const isOtherOnline = otherUserSockets.length > 0;

        // Check if counterparty is also in this specific chat room
        const roomSockets = await io.in(roomName).fetchSockets();
        const isOtherInRoom = roomSockets.some((s) => s.data.userId === otherUserId);

        // Inform joining socket about other party's presence
        socket.emit('room_presence', {
          orderId,
          otherUserId,
          isOnline: isOtherOnline || isOtherInRoom,
          inRoom: isOtherInRoom,
        });

        // Notify other party
        socket.to(roomName).emit('user_joined_chat', { userId });
        socket.to(`user_${otherUserId}`).emit('user_online', { userId });
        console.log(
          `[Socket] ${userName} joined room ${roomName} (otherUser ${otherUserId} isOnline: ${isOtherOnline || isOtherInRoom})`,
        );
      } catch (err) {
        console.error('[Socket] join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ── Event: send_message ──────────────────────────────────────────────────
    socket.on('send_message', async (payload: SendMessagePayload) => {
      const { orderId, text, attachments } = payload;

      if (!text?.trim() && (!attachments || attachments.length === 0)) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      try {
        // Access verification via ChatService
        const { chatRoom, recipientId } = await ChatService.verifyOrderParty(orderId, userId);

        if (!chatRoom) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        // Push to Kafka for persistence and dispatching
        await kafkaProducer.send({
          topic: KAFKA_TOPIC_CHAT,
          messages: [
            {
              key: chatRoom.id,
              value: JSON.stringify({
                chatRoomId: chatRoom.id,
                orderId,
                senderId: userId,
                recipientId,
                text: text?.trim() ?? undefined,
                attachments,
              }),
            },
          ],
        });
      } catch (err) {
        console.error('[Socket] send_message error:', err);
        socket.emit('error', { message: 'Failed to send message. Please try again.' });
      }
    });

    // ── Event: typing ────────────────────────────────────────────────────────
    socket.on('typing', (payload: TypingPayload) => {
      const { orderId, isTyping } = payload;
      socket.to(`order_${orderId}`).emit('user_typing', {
        userId,
        isTyping: Boolean(isTyping),
      });
    });

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] ${userName} (${userId}) disconnected: ${reason}`);
      const remainingSockets = await io.in(`user_${userId}`).fetchSockets();
      if (remainingSockets.length === 0) {
        socket.broadcast.emit('user_offline', { userId });
      }
    });
  });

  return io;
}

// ── Re-export for backward compatibility ──────────────────────────────────────
export const emitNotification = NotificationService.publishNotification.bind(NotificationService);
