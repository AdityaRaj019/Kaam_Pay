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
