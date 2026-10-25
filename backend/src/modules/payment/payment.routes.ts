import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/auth.middleware';
import { createRazorpayOrder, verifyRazorpayPayment } from './payment.controller';

const router = Router();

/**
 * @route  POST /api/payments/razorpay/create-order
 * @desc   Create Razorpay Order from existing KaamPay order ID (in INR paise)
 * @access Private — requires authenticated CLIENT
 */
router.post('/razorpay/create-order', requireAuth, authorize('CLIENT'), createRazorpayOrder);

/**
 * @route  POST /api/payments/razorpay/verify
 * @desc   Verify Razorpay payment signature & move order to PAID in Escrow
 * @access Private — requires authenticated CLIENT
 */
router.post('/razorpay/verify', requireAuth, authorize('CLIENT'), verifyRazorpayPayment);

export default router;
