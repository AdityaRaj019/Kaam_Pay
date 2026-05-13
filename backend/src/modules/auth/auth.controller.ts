import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './auth.types';
import { registerSchema, loginSchema } from './auth.validation';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

// Extend Express Request to carry a typed authenticated user
export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

// ─── Zod parse helper — formats errors as 422 ────────────────
const parseBody = <T>(schema: ZodSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join('; ');
    throw new AppError(message, 422);
  }
  return result.data;
};

// ─── Route handlers ───────────────────────────────────────────

/**
 * POST /api/auth/register
 * Validates payload with Zod, creates user & returns JWT.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const data = parseBody(registerSchema, req.body);
  const result = await AuthService.register(data);
  sendSuccess(res, 201, 'Account created successfully.', result);
});

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT on success.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const data = parseBody(loginSchema, req.body);
  const result = await AuthService.login(data);
  sendSuccess(res, 200, 'Login successful.', result);
});

/**
 * GET /api/auth/me  (Protected)
 * Returns the currently authenticated user's profile.
 */
export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated.', 401);
  const profile = await AuthService.getProfile(req.user.id);
  sendSuccess(res, 200, 'Profile fetched.', { user: profile });
});
