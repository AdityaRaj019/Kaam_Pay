import prisma from '../../config/prisma';
import { AuthProvider } from './auth.provider';
import { AppError } from '../../error/AppError';
import type { RegisterInput, LoginInput } from './auth.validation';
import type { AuthResponse, PublicUser, UserRole } from './auth.types';

// ─── Helpers ─────────────────────────────────────────────────
const toPublicUser = (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// ─── Service ─────────────────────────────────────────────────
export class AuthService {
  /**
   * Register a new user and persist to DB.
   * Throws 409 if email already taken.
   */
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const passwordHash = await AuthProvider.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = AuthProvider.generateToken({ id: user.id, role: user.role });

    return { user: toPublicUser(user), token };
  }

  /**
   * Validate credentials and return JWT.
   * Throws 401 for any invalid combination (timing-safe — same error).
   */
  static async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    // Always run compare to prevent timing attacks (even if user doesn't exist)
    const dummyHash = '$2b$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const passwordMatch = await AuthProvider.comparePassword(
      data.password,
      user?.passwordHash ?? dummyHash,
    );

    if (!user || !passwordMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = AuthProvider.generateToken({ id: user.id, role: user.role });

    const { passwordHash: _ph, ...publicFields } = user;
    return { user: toPublicUser(publicFields), token };
  }

  /**
   * Fetch the current user's profile (used by /me endpoint).
   */
  static async getProfile(id: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return toPublicUser(user);
  }
}
