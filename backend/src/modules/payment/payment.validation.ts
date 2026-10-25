import { z } from 'zod';

/**
 * Validation schema for initiating/creating a Razorpay order from an existing KaamPay order
 */
export const createRazorpayOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;

/**
 * Validation schema for verifying a Razorpay payment signature
 */
export const verifyRazorpayPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
