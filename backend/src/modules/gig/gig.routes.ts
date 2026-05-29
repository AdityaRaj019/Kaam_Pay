import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { createGig, getMyGigs, getAllGigs } from './gig.controller';
import { AppError } from '../../error';

const router = Router();

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const createGigRateLimiter = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute window
  const maxRequests = 3; // Strict limit due to Cloudinary upload overhead

  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  if (record.count >= maxRequests) {
    return next(
      new AppError(
        'Too many gig creation requests. Please try again in 1 minute.',
        429
      )
    );
  }

  record.count += 1;
  next();
};

/**
 * @route  POST /api/gigs/create
 * @desc   Create a new freelancer gig
 * @access Private — requires freelancer authentication and rate limiting
 */
router.post('/create', requireAuth, createGigRateLimiter, createGig);

/**
 * @route  GET /api/gigs/my-gigs
 * @desc   Get all gigs of the authenticated freelancer
 * @access Private — requires user authentication
 */
router.get('/my-gigs', requireAuth, getMyGigs);

/**
 * @route  GET /api/gigs
 * @desc   Get all active gigs (public browsing)
 * @access Public
 */
router.get('/', getAllGigs);

export default router;
