/**
 * chat.validation.ts — Zod validation schemas for Chat module
 */

import { z } from 'zod';

export const orderIdParamSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

export type OrderIdParamInput = z.infer<typeof orderIdParamSchema>;

export const initChatSchema = z
  .object({
    orderId: z.string().optional(),
    freelancerId: z.string().optional(),
    gigId: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.orderId || (data.freelancerId && data.gigId)),
    {
      message: 'Provide either orderId or both freelancerId and gigId',
      path: ['orderId'],
    },
  );

export type InitChatSchemaInput = z.infer<typeof initChatSchema>;

export const downloadAttachmentQuerySchema = z
  .object({
    url: z.string().optional(),
    fileName: z.string().optional(),
    publicId: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.url || data.publicId),
    {
      message: 'Attachment URL or publicId is required',
      path: ['url'],
    },
  );

export type DownloadAttachmentQueryInput = z.infer<typeof downloadAttachmentQuerySchema>;
