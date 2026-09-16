import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/auth.middleware';
import { createOrder } from './order.controller';

const router = Router();

/**
 * @route  POST /api/orders
 * @desc   Initiate a new order for a gig
 * @access Private — requires authenticated CLIENT user
 *
 * Middleware chain:
 *   1. requireAuth  — validates Better Auth session cookie, attaches req.user
 *   2. authorize('CLIENT') — rejects non-CLIENT roles with 403
 *   3. createOrder  — validates body, fetches pricing, creates order
 */
router.post('/', requireAuth, authorize('CLIENT'), createOrder);

export default router;
