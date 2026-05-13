import { Router } from 'express';
import authRoutes from './auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

// Future modules go here:
// router.use('/gigs',   gigRoutes);
// router.use('/orders', orderRoutes);

export default router;
