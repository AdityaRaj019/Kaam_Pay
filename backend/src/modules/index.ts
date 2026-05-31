import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import freelancerRoutes from './freelancer/freelancer.routes';
import gigRoutes from './gig/gig.routes';
import clientRoutes from './client/client.routes';

const router = Router();

// Custom auth endpoints (e.g., /api/auth/me)
// The main Better Auth handler (sign-up, sign-in, sign-out, etc.)
// is mounted directly in app.ts, before body parsing.
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/freelancer', freelancerRoutes);
router.use('/gigs', gigRoutes);
router.use('/client', clientRoutes);

export default router;
