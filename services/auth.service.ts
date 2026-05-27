import api from '../lib/axios';

/**
 * User shape — matches Better Auth session user + custom fields.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: string;
}

/**
 * Frontend Auth Service
 *
 * Sign-up, sign-in, and sign-out are now handled by the Better Auth
 * client (see lib/auth/auth-client.ts and hooks/useAuth.ts).
 *
 * This service only contains calls to CUSTOM auth endpoints
 * that extend Better Auth's built-in functionality.
 */
export const AuthService = {
  /**
   * GET /api/auth/me — fetch the authenticated user's full profile.
   * This is a custom endpoint (not part of Better Auth).
   * The session cookie is sent automatically by the browser.
   */
  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Re-export payload types for backwards compatibility
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'FREELANCER' | 'CLIENT';
}

export interface LoginPayload {
  email: string;
  password: string;
}
