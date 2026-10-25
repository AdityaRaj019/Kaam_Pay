import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from './payment.validation';
import { PaymentService } from './payment.service';

/**
 * POST /api/payments/razorpay/create-order
 *
 * Generates an official Razorpay order for an authenticated client's KaamPay order.
 */
export const createRazorpayOrder = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = createRazorpayOrderSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await PaymentService.createPaymentOrder(req.user.id, validation.data);

  sendSuccess(res, 201, 'Razorpay order created successfully.', result);
});

/**
 * POST /api/payments/razorpay/verify
 *
 * Verifies Razorpay checkout HMAC SHA-256 signature and locks funds in Escrow.
 */
export const verifyRazorpayPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = verifyRazorpayPaymentSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await PaymentService.verifyPayment(req.user.id, validation.data);

  sendSuccess(res, 200, 'Payment verified successfully and funds locked in Escrow.', result);
});
