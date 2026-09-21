import { Request, Response } from 'express';
import {
  createOrderSchema,
  orderIdParamSchema,
  transitionOrderStatusSchema,
  cancelOrderSchema,
  failPaymentSchema,
} from './order.validation';
import { OrderService } from './order.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * POST /api/orders
 *
 * Initiates a new order for the authenticated client in PENDING status.
 * (Creating an order does NOT equal paying for it; status is strictly PENDING).
 */
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

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

/**
 * GET /api/orders/:id
 *
 * Retrieves an order and its snapshotted pricing breakdown.
 */
export const getOrder = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = orderIdParamSchema.safeParse(req.params);
  if (!validation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const result = await OrderService.getOrderById(validation.data.id, req.user.id);

  sendSuccess(res, 200, 'Order retrieved successfully.', result);
});

/**
 * PATCH /api/orders/:id/status
 *
 * Transitions the order through the formal state machine:
 * PENDING -> PAYMENT_PENDING -> PAID -> IN_PROGRESS -> COMPLETED
 * or failure paths (-> CANCELLED, -> PAYMENT_FAILED)
 */
export const transitionOrderStatus = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const bodyValidation = transitionOrderStatusSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    const errorDetails = bodyValidation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await OrderService.transitionStatus(
    paramValidation.data.id,
    req.user.id,
    bodyValidation.data.status,
    bodyValidation.data.reason,
  );

  sendSuccess(res, 200, `Order transitioned to ${bodyValidation.data.status}.`, result);
});

/**
 * POST /api/orders/:id/cancel
 *
 * Cancels a PENDING or PAYMENT_PENDING order.
 */
export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const bodyValidation = cancelOrderSchema.safeParse(req.body);
  const reason = bodyValidation.success ? bodyValidation.data.reason : undefined;

  const result = await OrderService.cancelOrder(paramValidation.data.id, req.user.id, reason);

  sendSuccess(res, 200, 'Order cancelled successfully.', result);
});

/**
 * POST /api/orders/:id/payment-failed
 *
 * Records payment failure on a PENDING or PAYMENT_PENDING order.
 */
export const failPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const bodyValidation = failPaymentSchema.safeParse(req.body);
  const reason = bodyValidation.success ? bodyValidation.data.reason : undefined;

  const result = await OrderService.failPayment(paramValidation.data.id, req.user.id, reason);

  sendSuccess(res, 200, 'Order marked as payment failed.', result);
});

/**
 * POST /api/orders/:id/payment-pending
 *
 * Transitions order from PENDING to PAYMENT_PENDING when client initiates checkout.
 */
export const markPaymentPending = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const result = await OrderService.markPaymentPending(paramValidation.data.id, req.user.id);

  sendSuccess(res, 200, 'Order payment pending.', result);
});

/**
 * POST /api/orders/:id/pay
 *
 * Confirms payment completion (transitions PAYMENT_PENDING -> PAID).
 */
export const markPaid = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    throw new AppError('Invalid order ID parameter.', 400, ErrorCode.VALIDATION_ERROR);
  }

  const result = await OrderService.markPaid(paramValidation.data.id, req.user.id);

  sendSuccess(res, 200, 'Order paid successfully.', result);
});
