/**
 * notification.types.ts — Type definitions for the Notifications module
 */

export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  ORDER_PLACED: 'ORDER_PLACED',
  ORDER_ACCEPTED: 'ORDER_ACCEPTED',
  ORDER_SUBMITTED: 'ORDER_SUBMITTED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  ORDER_REVISION: 'ORDER_REVISION',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  NEW_REVIEW: 'NEW_REVIEW',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES] | string;

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
}

export interface OfflineNotificationInput extends CreateNotificationInput {
  senderId?: string;
  senderName?: string;
  orderId?: string;
  createdAt?: string;
}

export interface NotificationPayload {
  userId: string;
  type: string;
  message: string;
}

export interface OfflineNotificationPayload {
  userId: string;
  senderId: string;
  senderName: string;
  orderId: string;
  type: string;
  message: string;
  createdAt?: string;
}

export interface GetNotificationsQuery {
  limit?: number;
  unreadOnly?: boolean;
}
