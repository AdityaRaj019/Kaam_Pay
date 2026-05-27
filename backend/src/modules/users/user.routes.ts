import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { completeFreelancerOnboarding } from './user.controller';

const router = Router();

/**
 * @route  POST /api/users/onboarding
 * @desc   Complete onboarding for a freelancer (sets role to FREELANCER and creates profile)
 * @access Private — requires valid session cookie
 */
router.post('/onboarding', requireAuth, completeFreelancerOnboarding);

export default router;
