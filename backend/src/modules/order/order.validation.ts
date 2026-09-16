import { z } from 'zod';

/**
 * Schema for POST /api/orders
 *
 * Only the gig identifier is accepted from the client.
 * All financial calculations (price, platform fee, total) are
 * determined server-side from the authoritative gig record.
 *
 * If the frontend sends a `price` field it is silently stripped
 * by Zod's strict object parsing — the server is the single
 * source of truth for all monetary values.
 */
export const createOrderSchema = z.object({
  gigId: z
    .string()
    .min(1, 'Gig ID is required'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

