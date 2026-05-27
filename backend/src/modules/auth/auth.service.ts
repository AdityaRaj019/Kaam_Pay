import prisma from '../../config/prisma';
import { AppError } from '../../error/AppError';
import type { PublicUser, UserRole } from './auth.types';

// ─── Helpers ─────────────────────────────────────────────────

const toPublicUser = (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
}): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  image: user.image,
  createdAt: user.createdAt,
});

// ─── Service ─────────────────────────────────────────────────

/**
 * Auth Service
 *
 * Registration and login logic has been removed — Better Auth
 * handles those flows automatically (password hashing, session
 * creation, cookie issuance).
 *
 * This service only contains custom business logic that extends
 * the default Better Auth functionality.
 */
export class AuthService {
  /**
   * Fetch the current user's profile (used by /me endpoint).
   * Includes business-specific fields that Better Auth doesn't
   * expose by default.
   */
  static async getProfile(id: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return toPublicUser(user);
  }
}
