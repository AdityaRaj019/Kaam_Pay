/**
 * notification.controller.ts — HTTP Controller for Notifications
 *
 * GET   /api/notifications       — list user's notifications (newest first, with unread count)
 * POST  /api/notifications/read  — mark all as read
 * PATCH /api/notifications/:id/read — mark single notification as read
 */

import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { NotificationService } from './notification.service';
import {
  getNotificationsQuerySchema,
  markOneReadParamsSchema,
} from './notification.validation';

/**
 * GET /api/notifications
 */
export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const queryValidation = getNotificationsQuerySchema.safeParse(req.query);
  const query = queryValidation.success ? queryValidation.data : undefined;

  const result = await NotificationService.getUserNotifications(req.user.id, query);

  sendSuccess(res, 200, 'Notifications retrieved successfully', result.notifications);
});

/**
 * POST /api/notifications/read
 */
export const markAllRead = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const count = await NotificationService.markAllAsRead(req.user.id);

  sendSuccess(res, 200, 'All notifications marked as read', { updatedCount: count });
});

/**
 * PATCH /api/notifications/:id/read
 */
export const markOneRead = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramsValidation = markOneReadParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new AppError('Invalid notification ID', 400, ErrorCode.VALIDATION_ERROR);
  }

  const notification = await NotificationService.markOneAsRead(
    paramsValidation.data.id,
    req.user.id,
  );

  sendSuccess(res, 200, 'Notification marked as read', notification);
});
