import { Router, Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../../config/auth';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { getMe } from './auth.controller';

const router = Router();

/**
 * @route  GET /api/auth/me
 * @desc   Return the authenticated user's profile (custom endpoint)
 * @access Private — requires valid session cookie
 */
router.get('/me', requireAuth, getMe);

export default router;
