import { z } from 'zod';

export const MAX_ORDER_QUANTITY = 100;

/**
 * Schema for POST /api/orders
 *
 * Validates:
 * - gig_id / gigId exists in request as a non-empty CUID string
 * - quantity exists, is an integer, > 0, and does not exceed maximum (100)
 *
 * All financial calculations (unit price, subtotal, platform fee, total)
 * are determined server-side from the authoritative gig record.
 */
export const createOrderSchema = z
  .object({
    gig_id: z.string().min(1, 'Gig ID is required').optional(),
    gigId: z.string().min(1, 'Gig ID is required').optional(),
    quantity: z
      .number({ message: 'Quantity is required' })
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
      .max(MAX_ORDER_QUANTITY, `Quantity cannot exceed ${MAX_ORDER_QUANTITY}`),
  })
  .refine((data) => Boolean(data.gig_id || data.gigId), {
    message: 'Gig ID is required',
    path: ['gig_id'],
  })
  .transform((data) => ({
    gigId: (data.gig_id || data.gigId) as string,
    quantity: data.quantity,
  }));

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderIdParamSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
});

export type OrderIdParam = z.infer<typeof orderIdParamSchema>;

export const transitionOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'PAYMENT_PENDING',
    'PAID',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVISION',
    'COMPLETED',
    'CANCELLED',
    'PAYMENT_FAILED',
    'DISPUTED',
  ] as const),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export type TransitionOrderStatusInput = z.infer<typeof transitionOrderStatusSchema>;

export const cancelOrderSchema = z.object({
  reason: z.string().max(500, 'Cancellation reason cannot exceed 500 characters').optional(),
});

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

export const failPaymentSchema = z.object({
  reason: z.string().max(500, 'Failure reason cannot exceed 500 characters').optional(),
});

export type FailPaymentInput = z.infer<typeof failPaymentSchema>;
