// UserRole is the Prisma-generated enum
// We re-export it here so backend modules don't need long relative paths to lib/
export const UserRole = {
  CLIENT: 'CLIENT',
  FREELANCER: 'FREELANCER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─────────────────────────────────────────────────────────────
// Auth domain types (Better Auth session-based)
// ─────────────────────────────────────────────────────────────

/**
 * Shape of the user object attached to req.user by
 * the requireAuth middleware after session validation.
 */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  profile?: {
    title: string | null;
    bio: string | null;
    skills: string[];
    hourlyRate: number | null;
    experience: string | null;
    purpose: string | null;
  } | null;
}
