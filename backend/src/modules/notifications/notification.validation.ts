/**
 * notification.validation.ts — Zod validation schemas for Notifications module
 */

import { z } from 'zod';

export const getNotificationsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().min(1).max(100)),
  unreadOnly: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export type GetNotificationsQueryInput = z.infer<typeof getNotificationsQuerySchema>;

export const markOneReadParamsSchema = z.object({
  id: z.string().min(1, 'Notification ID is required'),
});

export type MarkOneReadParamsInput = z.infer<typeof markOneReadParamsSchema>;
