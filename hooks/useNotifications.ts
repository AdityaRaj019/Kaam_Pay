'use client';

/**
 * useNotifications.ts — Manages real-time and persisted notifications
 *
 * On mount: fetches existing notifications from the database via REST
 * On socket event: appends new real-time notifications + shows a toast
 * Provides: unreadCount (for the bell badge), markAllRead function
 */

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { getSocket, connectSocket } from '@/lib/socket';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derived: count of unread notifications for the bell badge
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Load persisted notifications from DB ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.data as AppNotification[]);
      } catch {
        // Silently fail — notifications are non-critical
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Listen for real-time notifications via Socket.io ────────────────────
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const onNotification = (notification: AppNotification) => {
      // Prepend to list (newest first)
      setNotifications((prev) => [notification, ...prev]);

      // Show a toast popup based on notification type
      const icon = getNotificationIcon(notification.type);
      toast(notification.message, {
        icon,
        duration: 5000,
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
        },
      });
    };

    socket.on('notification', onNotification);
    return () => { socket.off('notification', onNotification); };
  }, []);

  // ── Mark all as read ─────────────────────────────────────────────────────
  const markAllRead = async () => {
    try {
      await api.post('/notifications/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  return { notifications, isLoading, unreadCount, markAllRead };
}

// ── Icon helper ───────────────────────────────────────────────────────────────

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    NEW_MESSAGE: '💬',
    ORDER_PLACED: '🛍️',
    ORDER_ACCEPTED: '✅',
    ORDER_SUBMITTED: '📦',
    ORDER_COMPLETED: '🎉',
    ORDER_REVISION: '🔄',
    ORDER_CANCELLED: '❌',
    NEW_REVIEW: '⭐',
  };
  return icons[type] ?? '🔔';
}
