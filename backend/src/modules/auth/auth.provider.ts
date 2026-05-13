import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../../error/AppError';
import { JwtPayload } from './auth.types';

const BCRYPT_ROUNDS = 12;

// Lazily read the secret so dotenv has time to load in server.ts first
const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET is not configured on this server.', 500);
  }
  return secret;
};

const getExpiresIn = (): SignOptions['expiresIn'] =>
  (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

// ─── Exported utility class ──────────────────────────────────
export class AuthProvider {
  // ── Bcrypt ─────────────────────────────────────────────────
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  // ── JWT ────────────────────────────────────────────────────
  static generateToken(payload: JwtPayload): string {
    const { iat, exp, ...cleanPayload } = payload;
    return jwt.sign(cleanPayload, getSecret(), {
      expiresIn: getExpiresIn(),
    });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, getSecret()) as JwtPayload;
    } catch (err: unknown) {
      // Narrow `unknown` to a structured error before reading properties
      const name = err instanceof Error ? err.name : '';
      if (name === 'TokenExpiredError') {
        throw new AppError('Your session has expired. Please log in again.', 401);
      }
      throw new AppError('Invalid token. Please log in again.', 401);
    }
  }
}
