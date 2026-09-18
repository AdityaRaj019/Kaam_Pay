/**
 * chat.socket.ts — Socket.io server with Redis adapter
 *
 * This is the "telephone exchange" of the chat system.
 * It manages:
 *  - User authentication (mapping socket IDs to user IDs)
 *  - Chat room access control (only order parties can join)
 *  - Message routing to Kafka
 *  - Online presence (green/red dot)
 *  - Typing indicators (debounced on the frontend)
 */

import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis';
import { kafkaProducer, KAFKA_TOPIC_CHAT, KAFKA_TOPIC_NOTIFICATIONS } from '../config/kafka';
import prisma from '../config/prisma';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';

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

export async function initSocketServer(httpServer: HttpServer): Promise<SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>> {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',');

  const io = new SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true, // needed so the browser sends session cookies
    },
    // Allow both WebSocket and HTTP polling.
    // Polling is slower but works behind strict firewalls/proxies.
    transports: ['websocket', 'polling'],
  });

  // Wire up the Redis adapter — this makes Socket.io state (rooms, sockets)
  // shared across multiple server instances (horizontal scaling)
  io.adapter(createAdapter(pubClient, subClient));
  console.log('[Socket.io] Redis adapter attached ✅');

  // ── Authentication middleware ───────────────────────────────────────────────
  // This runs BEFORE any event handler. If auth fails, the connection is rejected.
  io.use(async (socket, next) => {
    try {
      // Better Auth reads the session from the cookie header
      // The browser sends cookies automatically with credentials: true
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.request.headers as Record<string, string>),
      });

      if (!session?.user) {
        return next(new Error('Authentication failed: no valid session'));
      }

      // Store user info on the socket for use in event handlers
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
    // Every notification for this user is sent to room `user_{userId}`
    await socket.join(`user_${userId}`);

    // Broadcast to ALL other connected sockets: "this user came online"
    // Other clients use this to update the presence dot
    socket.broadcast.emit('user_online', { userId });

    // ── Event: join_room ─────────────────────────────────────────────────────
    // Frontend emits this when the user opens an order's chat window
    socket.on('join_room', async (payload: JoinRoomPayload) => {
      const { orderId } = payload;

      try {
        // Security check: user must be the client OR freelancer for this order
        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            OR: [{ clientId: userId }, { freelancerId: userId }],
          },
          include: { chatRoom: true },
        });

        if (!order || !order.chatRoom) {
          socket.emit('error', { message: 'Chat room not found or access denied' });
          return;
        }

        // The room name is based on the Order ID so it's easy to join from the frontend
        const roomName = `order_${orderId}`;
        await socket.join(roomName);

        // Counterparty is whoever is NOT the current user
        const otherUserId = order.clientId === userId ? order.freelancerId : order.clientId;

        // Check if counterparty has any connected sockets in user_{otherUserId}
        const otherUserSockets = await io.in(`user_${otherUserId}`).fetchSockets();
        const isOtherOnline = otherUserSockets.length > 0;

        // Check if counterparty is also in this specific chat room
        const roomSockets = await io.in(roomName).fetchSockets();
        const isOtherInRoom = roomSockets.some((s) => s.data.userId === otherUserId);

        // Inform the joining socket immediately about the other party's presence
        socket.emit('room_presence', {
          orderId,
          otherUserId,
          isOnline: isOtherOnline || isOtherInRoom,
          inRoom: isOtherInRoom,
        });

        // Tell the other party that this user is now in the chat
        socket.to(roomName).emit('user_joined_chat', { userId });
        socket.to(`user_${otherUserId}`).emit('user_online', { userId });
        console.log(`[Socket] ${userName} joined room ${roomName} (otherUser ${otherUserId} isOnline: ${isOtherOnline || isOtherInRoom})`);
      } catch (err) {
        console.error('[Socket] join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ── Event: send_message ──────────────────────────────────────────────────
    // Frontend emits this to send a message (text, files, or both)
    socket.on('send_message', async (payload: SendMessagePayload) => {
      const { orderId, text, attachments } = payload;

      // Basic validation
      if (!text?.trim() && (!attachments || attachments.length === 0)) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      try {
        // Look up the chat room and the other party's ID
        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            OR: [{ clientId: userId }, { freelancerId: userId }],
          },
          include: { chatRoom: true },
        });

        if (!order?.chatRoom) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        // The recipient is whoever is NOT the current user
        const recipientId = order.clientId === userId ? order.freelancerId : order.clientId;

        // Push to Kafka — the consumer will save to DB and broadcast back
        // Using chatRoomId as the Kafka message key ensures ordered delivery per room
        await kafkaProducer.send({
          topic: KAFKA_TOPIC_CHAT,
          messages: [
            {
              key: order.chatRoom.id,
              value: JSON.stringify({
                chatRoomId: order.chatRoom.id,
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
    // Frontend emits this when the user starts/stops typing (debounced on the client)
    socket.on('typing', (payload: TypingPayload) => {
      const { orderId, isTyping } = payload;
      // Broadcast ONLY to others in the room (not back to the sender)
      socket.to(`order_${orderId}`).emit('user_typing', {
        userId,
        isTyping: Boolean(isTyping),
      });
    });

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] ${userName} (${userId}) disconnected: ${reason}`);
      // Only emit user_offline if the user has no remaining active socket connections
      const remainingSockets = await io.in(`user_${userId}`).fetchSockets();
      if (remainingSockets.length === 0) {
        socket.broadcast.emit('user_offline', { userId });
      }
    });
  });

  return io;
}

// ── Utility: send a notification through Kafka ────────────────────────────────
// Call this from your order/gig controllers when order status changes, etc.

export async function emitNotification(userId: string, type: string, message: string): Promise<void> {
  await kafkaProducer.send({
    topic: KAFKA_TOPIC_NOTIFICATIONS,
    messages: [
      {
        key: userId,
        value: JSON.stringify({ userId, type, message }),
      },
    ],
  });
}
