import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../../error';
import { auth } from '../../config/auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { AuthenticatedUser, UserRole } from '../../modules/auth/auth.types';

/**
 * requireAuth — validates the Better Auth session cookie and
 * attaches the authenticated user to req.user.
 *
 * Replaces the old JWT Bearer token middleware.
 * Better Auth reads the HTTP-only session cookie from the request
 * headers and validates it against the database-backed session store.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return next(new AppError('Not authenticated. Please sign in.', 401, ErrorCode.UNAUTHORIZED));
    }

    // Attach the session user to req.user for downstream handlers
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user.role as UserRole) ?? 'CLIENT',
      emailVerified: session.user.emailVerified,
      image: session.user.image ?? null,
    } satisfies AuthenticatedUser;

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * authorize — role guard. Must come after requireAuth.
 *
 * Usage: router.delete('/admin/user/:id', requireAuth, authorize('ADMIN'), handler)
 */
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          403,
          ErrorCode.FORBIDDEN,
        ),
      );
    }
    next();
  };
