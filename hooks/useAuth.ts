import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth/auth-client';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'FREELANCER' | 'CLIENT';
}

/**
 * useAuth — frontend auth hook powered by Better Auth.
 *
 * Replaces the old axios-based JWT flow with Better Auth's
 * client methods. All auth operations use HTTP-only session cookies
 * instead of storing tokens in localStorage.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, clearUser } = useAuthStore();

  /**
   * Extract user fields from the Better Auth response into our store shape.
   * Better Auth returns a flat user object — custom fields (like `role`)
   * are included but not in the TypeScript type, so we cast carefully.
   */
  const extractUser = (user: Record<string, unknown>) => ({
    id: user.id as string,
    name: user.name as string,
    email: user.email as string,
    emailVerified: (user.emailVerified as boolean) ?? false,
    image: (user.image as string) ?? null,
    role: (user.role as string) ?? 'CLIENT',
    createdAt: user.createdAt
      ? new Date(user.createdAt as string).toISOString()
      : new Date().toISOString(),
  });

  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to login');
      }

      if (result.data?.user) {
        setUser(extractUser(result.data.user as unknown as Record<string, unknown>));
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        // Custom fields are passed at the top level — Better Auth
        // forwards them to the User model via `additionalFields` config.
        role: data.role,
      } as Parameters<typeof authClient.signUp.email>[0] & { role: string });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to register');
      }

      if (result.data?.user) {
        setUser(extractUser(result.data.user as unknown as Record<string, unknown>));
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      clearUser();
      toast.success('Logged out successfully!');
      router.push('/');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return { login, register, logout, isLoading, error };
};
