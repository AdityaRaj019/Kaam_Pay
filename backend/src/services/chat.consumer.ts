/**
 * chat.consumer.ts — Kafka Consumer for chat messages and notifications
 *
 * Background worker that:
 *  1. Reads messages from Kafka topics
 *  2. Saves them permanently via ChatService and NotificationService
 *  3. Dispatches real-time Socket.io events to online users
 *  4. Directs notifications for offline users to the dedicated offline queue & persistence
 */

import { Server as SocketServer } from 'socket.io';
import {
  kafkaConsumer,
  KAFKA_TOPIC_CHAT,
  KAFKA_TOPIC_NOTIFICATIONS,
  KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
} from '../config/kafka';
import { ChatService } from '../modules/chat/chat.service';
import type { ChatMessagePayload } from '../modules/chat/chat.types';
import { NotificationService } from '../modules/notifications/notification.service';
import {
  NOTIFICATION_TYPES,
  type NotificationPayload,
  type OfflineNotificationPayload,
} from '../modules/notifications/notification.types';

/**
 * Call this once at server startup.
 * Connects to Kafka and begins processing messages indefinitely.
 */
export async function startChatConsumer(io: SocketServer): Promise<void> {
  await kafkaConsumer.connect();
  console.log('[Kafka Consumer] Connected ✅');

  await kafkaConsumer.subscribe({
    topics: [KAFKA_TOPIC_CHAT, KAFKA_TOPIC_NOTIFICATIONS, KAFKA_TOPIC_OFFLINE_NOTIFICATIONS],
    fromBeginning: false, // only process new messages
  });

  await kafkaConsumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString()) as Record<string, unknown>;

        if (topic === KAFKA_TOPIC_CHAT) {
          await handleChatMessage(io, payload as unknown as ChatMessagePayload);
        } else if (topic === KAFKA_TOPIC_NOTIFICATIONS) {
          await handleNotification(io, payload as unknown as NotificationPayload);
        } else if (topic === KAFKA_TOPIC_OFFLINE_NOTIFICATIONS) {
          await handleOfflineNotification(io, payload as unknown as OfflineNotificationPayload);
        }
      } catch (err) {
        console.error(`[Kafka Consumer] Failed to process message on topic "${topic}":`, err);
      }
    },
  });
}

// ── Chat message handler ──────────────────────────────────────────────────────

async function handleChatMessage(io: SocketServer, payload: ChatMessagePayload): Promise<void> {
  const { orderId, senderId, recipientId, text, attachments } = payload;

  // 1. Persist the message to PostgreSQL via ChatService
  const savedMessage = await ChatService.saveIncomingMessage(payload);

  // 2. Broadcast to the order room — only the two parties are in this room
  const roomName = `order_${orderId}`;
  io.to(roomName).emit('receive_message', savedMessage);

  // 3. Presence discrimination: check whether recipient is in room or online
  const socketsInRoom = await io.in(roomName).fetchSockets();
  const recipientInRoom = socketsInRoom.some((s) => s.data.userId === recipientId);

  const recipientSockets = await io.in(`user_${recipientId}`).fetchSockets();
  const recipientIsOnline = recipientSockets.length > 0;

  const senderName = savedMessage.sender.name || 'User';
  const preview = text
    ? text.length > 50
      ? text.slice(0, 50) + '…'
      : text
    : `${attachments?.length ?? 1} file(s)`;
  const notificationText = `${senderName}: ${preview}`;

  if (!recipientInRoom) {
    if (recipientIsOnline) {
      // Recipient is online on the site but not in this chat room
      try {
        await NotificationService.publishNotification(
          recipientId,
          NOTIFICATION_TYPES.NEW_MESSAGE,
          notificationText,
        );
      } catch (err) {
        console.error('[Kafka Consumer] Failed to send in-app notification to Kafka:', err);
      }
    } else {
      // Recipient is completely OFFLINE
      try {
        await NotificationService.publishOfflineNotification({
          userId: recipientId,
          senderId,
          senderName,
          orderId,
          type: NOTIFICATION_TYPES.NEW_MESSAGE,
          message: notificationText,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `[Kafka Producer] Dispatched offline notification to ${KAFKA_TOPIC_OFFLINE_NOTIFICATIONS} for user ${recipientId} (from ${senderName})`,
        );
      } catch (err) {
        console.error('[Kafka Consumer] Failed to send offline notification to Kafka:', err);
      }
    }
  }
}

// ── Notification handler (in-app / general) ───────────────────────────────────

async function handleNotification(io: SocketServer, payload: NotificationPayload): Promise<void> {
  await NotificationService.persistAndDispatch(payload, io);
}

// ── Offline Notification handler ──────────────────────────────────────────────

async function handleOfflineNotification(
  io: SocketServer,
  payload: OfflineNotificationPayload,
): Promise<void> {
  const notification = await NotificationService.persistAndDispatch(
    {
      userId: payload.userId,
      type: payload.type || NOTIFICATION_TYPES.NEW_MESSAGE,
      message: payload.message,
    },
    io,
  );

  console.log(
    `[Kafka Consumer] Stored offline notification (id: ${notification.id}) for user ${payload.userId} from ${payload.senderName} ✅`,
  );
}
