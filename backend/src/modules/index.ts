import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';

const router = Router();

// Custom auth endpoints (e.g., /api/auth/me)
// The main Better Auth handler (sign-up, sign-in, sign-out, etc.)
// is mounted directly in app.ts, before body parsing.
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Future modules go here:
// router.use('/gigs',   gigRoutes);
// router.use('/orders', orderRoutes);

export default router;
