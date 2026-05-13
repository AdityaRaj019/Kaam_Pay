import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../../error';
import { AuthProvider } from '../../modules/auth/auth.provider';
import { AuthenticatedUser } from '../../modules/auth/auth.types';
import prisma from '../../config/prisma';

/**
 * authenticate — verifies the Bearer JWT and attaches req.user.
 * Must be used on any route that requires a logged-in user.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('No authentication token provided.', 401, ErrorCode.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    // verifyToken throws typed AppError on expiry / invalid
    const decoded = AuthProvider.verifyToken(token);

    // Confirm the user still exists in the DB (handles deleted/deactivated accounts)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return next(
        new AppError(
          'The account associated with this token no longer exists.',
          401,
          ErrorCode.UNAUTHORIZED,
        ),
      );
    }

    req.user = user;
    next();
  } catch (err) {
    // Pass AppErrors thrown by verifyToken straight through
    next(err);
  }
};

/**
 * authorize — role guard. Must come after authenticate.
 *
 * Usage: router.delete('/admin/user/:id', authenticate, authorize('ADMIN'), handler)
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
