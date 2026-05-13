// UserRole is the Prisma-generated enum
// We re-export it here so backend modules don't need long relative paths to lib/
export const UserRole = {
  CLIENT: 'CLIENT',
  FREELANCER: 'FREELANCER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─────────────────────────────────────────────────────────────
// Auth domain types
// ─────────────────────────────────────────────────────────────

/** Attached to req.user after JWT verification */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Safe public shape returned to clients — no passwordHash */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/** JWT payload written into every token */
export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Shape returned by register / login */
export interface AuthResponse {
  user: PublicUser;
  token: string;
}

/** Input DTO for registration */
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Input DTO for login */
export interface LoginDTO {
  email: string;
  password: string;
}
