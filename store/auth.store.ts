import { create } from 'zustand';

/**
 * User shape returned by Better Auth session.
 * Matches the Better Auth user object + custom `role` field.
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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /**
   * Set the authenticated user (called after Better Auth session check).
   * No token needed — auth uses HTTP-only cookies.
   */
  setUser: (user: User) => void;

  /** Clear the local state (called after signOut) */
  clearUser: () => void;

  /** Set loading state during session checks */
  setLoading: (loading: boolean) => void;
}

/**
 * Auth Store
 *
 * With Better Auth, we NO LONGER store tokens in localStorage.
 * Authentication is entirely cookie-based (HTTP-only, Secure).
 * This store only holds the user object for UI rendering.
 *
 * Session validation happens server-side via cookies — the store
 * is populated by calling `useSession()` from Better Auth client.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  clearUser: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
