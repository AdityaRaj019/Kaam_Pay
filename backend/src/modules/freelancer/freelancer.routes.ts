import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { updateFreelancerProfile } from './freelancer.controller';
import { AppError } from '../../error';

const router = Router();

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const updateRateLimiter = (req: Request, _res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute window
  const maxRequests = 5;

  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  if (record.count >= maxRequests) {
    return next(new AppError('Too many profile update requests. Please try again in 1 minute.', 429));
  }

  record.count += 1;
  next();
};

/**
 * @route  POST /api/freelancer/update
 * @desc   Update freelancer profile details (bio, skills, resumeUrl, title, hourlyRate)
 * @access Private — requires user session and applies a 5 request/min rate limit
 */
router.post('/update', requireAuth, updateRateLimiter, updateFreelancerProfile);

export default router;
