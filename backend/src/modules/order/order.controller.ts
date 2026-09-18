import { Request, Response } from 'express';
import { createOrderSchema } from './order.validation';
import { OrderService } from './order.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * POST /api/orders
 *
 * Initiates a new order for the authenticated client.
 *
 * Authentication is enforced at the route level by `requireAuth`.
 * Role restriction (CLIENT only) is enforced by `authorize('CLIENT')`.
 * By the time this handler executes, req.user is guaranteed to exist
 * and represent a verified CLIENT user.
 *
 * The controller validates the request body (only gigId accepted),
 * delegates to the service layer for server-side pricing and order
 * creation, and returns the created order with its pricing breakdown.
 */
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Double-guard: requireAuth middleware guarantees this,
  // but we enforce it here for defence-in-depth.
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  // Validate request body — only gigId is accepted.
  // Any extraneous fields (e.g., price) are stripped by Zod.
  const validation = createOrderSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await OrderService.initiateOrder(req.user.id, validation.data);

  sendSuccess(res, 201, 'Order created successfully.', result);
});
