/**
 * notification.controller.ts
 *
 * GET  /api/notifications        — list user's notifications (newest first)
 * POST /api/notifications/read   — mark all as read
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';

// ── GET /api/notifications ────────────────────────────────────────────────────

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // max 50 notifications returned at once
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, data: notifications, meta: { unreadCount } });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/notifications/read ─────────────────────────────────────────────

export async function markAllRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}
