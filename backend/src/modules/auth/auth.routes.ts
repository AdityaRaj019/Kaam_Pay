import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { authenticate } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user (CLIENT or FREELANCER)
 * @access Public
 */
router.post('/register', register);

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user and return JWT
 * @access Public
 */
router.post('/login', login);

/**
 * @route  GET /api/auth/me
 * @desc   Return the authenticated user's profile
 * @access Private — requires Bearer token
 */
router.get('/me', authenticate, getMe);

export default router;
