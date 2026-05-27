import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * Auth Controller
 *
 * Register & login are now handled automatically by Better Auth
 * (via the catch-all handler in auth.routes.ts).
 *
 * This controller only contains custom endpoints that extend
 * the default Better Auth functionality.
 */

/**
 * GET /api/auth/me  (Protected)
 *
 * Returns the currently authenticated user's full profile.
 * The session user is attached by the `requireAuth` middleware.
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  // req.user is set by requireAuth middleware (session-based)
  if (!req.user) {
    throw new AppError('Not authenticated.', 401);
  }

  const profile = await AuthService.getProfile(req.user.id);
  sendSuccess(res, 200, 'Profile fetched.', { user: profile });
});
