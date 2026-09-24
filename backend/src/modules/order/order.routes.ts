import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/auth.middleware';
import {
  createOrder,
  getOrder,
  getOrderByIdempotencyKey,
  transitionOrderStatus,
  cancelOrder,
  failPayment,
  markPaymentPending,
  markPaid,
  completeOrder,
} from './order.controller';

const router = Router();

/**
 * @route  POST /api/orders
 * @desc   Initiate a new order for a gig (Created in PENDING status, idempotent)
 * @access Private — requires authenticated CLIENT user
 */
router.post('/', requireAuth, authorize('CLIENT'), createOrder);

/**
 * @route  GET /api/orders/key/:key
 * @desc   Retrieve order by its unique idempotency key
 * @access Private — requires authenticated order participant
 */
router.get('/key/:key', requireAuth, getOrderByIdempotencyKey);

/**
 * @route  GET /api/orders/:id
 * @desc   Retrieve order details and locked price snapshot for cart/checkout
 * @access Private — requires authenticated user (client or freelancer of the order)
 */
router.get('/:id', requireAuth, getOrder);

/**
 * @route  PATCH /api/orders/:id/status
 * @desc   Transition order through the formal state machine
 * @access Private — requires authenticated order participant
 */
router.patch('/:id/status', requireAuth, transitionOrderStatus);

/**
 * @route  POST /api/orders/:id/payment-pending
 * @desc   Transition PENDING -> PAYMENT_PENDING when buyer launches payment
 * @access Private — requires authenticated client
 */
router.post('/:id/payment-pending', requireAuth, markPaymentPending);

/**
 * @route  POST /api/orders/:id/pay
 * @desc   Confirm payment completion: PAYMENT_PENDING -> PAID
 * @access Private — requires authenticated user or payment callback
 */
router.post('/:id/pay', requireAuth, markPaid);

/**
 * @route  POST /api/orders/:id/complete
 * @desc   Approve and complete work: IN_PROGRESS -> COMPLETED
 * @access Private — requires authenticated client
 */
router.post('/:id/complete', requireAuth, completeOrder);

/**
 * @route  POST /api/orders/:id/cancel
 * @desc   Cancel a PENDING or PAYMENT_PENDING order
 * @access Private — requires authenticated client
 */
router.post('/:id/cancel', requireAuth, cancelOrder);

/**
 * @route  POST /api/orders/:id/payment-failed
 * @desc   Record payment failure: PENDING/PAYMENT_PENDING -> PAYMENT_FAILED
 * @access Private — requires authenticated client
 */
router.post('/:id/payment-failed', requireAuth, failPayment);

export default router;
