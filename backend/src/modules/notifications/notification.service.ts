/**
 * notification.service.ts — Service layer for the Notifications module
 *
 * Encapsulates all notification operations:
 *  - Fetching user notifications & unread counts
 *  - Marking notifications as read (single or batch)
 *  - Persisting notifications & dispatching via Socket.io
 *  - Publishing notification events to Kafka topics
 */

import { Server as SocketServer } from 'socket.io';
import prisma from '../../config/prisma';
import {
  kafkaProducer,
  KAFKA_TOPIC_NOTIFICATIONS,
  KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
} from '../../config/kafka';
import { AppError, ErrorCode } from '../../error/AppError';
import type {
  CreateNotificationInput,
  OfflineNotificationPayload,
} from './notification.types';
import type { GetNotificationsQueryInput } from './notification.validation';

export class NotificationService {
  /**
   * Retrieves paginated/limited notifications for a user, along with total unread count.
   */
  static async getUserNotifications(userId: string, query?: GetNotificationsQueryInput) {
    const limit = query?.limit ?? 50;
    const isUnreadOnly = query?.unreadOnly ?? false;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          ...(isUnreadOnly ? { isRead: false } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  }

  /**
   * Marks all unread notifications for a user as read.
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return result.count;
  }

  /**
   * Marks a specific notification as read after verifying ownership.
   */
  static async markOneAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404, ErrorCode.NOT_FOUND);
    }

    if (notification.userId !== userId) {
      throw new AppError('Access denied to this notification', 403, ErrorCode.FORBIDDEN);
    }

    if (notification.isRead) {
      return notification;
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Persists a notification to PostgreSQL and pushes a real-time event to the user's socket room.
   */
  static async persistAndDispatch(payload: CreateNotificationInput, io?: SocketServer) {
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        message: payload.message,
      },
    });

    if (io) {
      io.to(`user_${payload.userId}`).emit('notification', notification);
    }

    return notification;
  }

  /**
   * Publishes an in-app notification event to Kafka for asynchronous delivery and persistence.
   */
  static async publishNotification(userId: string, type: string, message: string): Promise<void> {
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

  /**
   * Publishes an offline notification event to the dedicated Kafka offline topic.
   */
  static async publishOfflineNotification(payload: OfflineNotificationPayload): Promise<void> {
    await kafkaProducer.send({
      topic: KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
      messages: [
        {
          key: payload.userId,
          value: JSON.stringify(payload),
        },
      ],
    });
  }
}
