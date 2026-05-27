import { createAuthClient } from 'better-auth/react';
import { twoFactorClient } from 'better-auth/client/plugins';

/**
 * Better Auth Client
 *
 * Initializes the frontend auth client pointing to the backend API.
 * All auth operations (sign-in, sign-up, sign-out, session checks)
 * use HTTP-only cookies — no tokens are stored in localStorage.
 *
 * Usage in components:
 *   import { authClient } from '@/lib/auth/auth-client';
 *
 *   // Sign up
 *   await authClient.signUp.email({ email, password, name });
 *
 *   // Sign in
 *   await authClient.signIn.email({ email, password });
 *
 *   // Sign out
 *   await authClient.signOut();
 *
 *   // Get session (React hook)
 *   const { data: session } = authClient.useSession();
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:5000',
  plugins: [
    twoFactorClient({
      // Redirect users here if they need to verify 2nd factor
      twoFactorPage: '/two-factor',
    }),
  ],
});

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
