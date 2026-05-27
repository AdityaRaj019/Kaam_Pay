import { z } from 'zod';

/**
 * Auth Validation Schemas
 *
 * Better Auth handles its own input validation for sign-up/sign-in
 * endpoints. These schemas are kept for:
 *  - Any custom auth-related endpoints you build later
 *  - Re-use in frontend validation (shared schemas)
 *  - Additional business validation (e.g., role assignment)
 */

// ─── Register schema ─────────────────────────────────────────
// Used for additional validation on custom endpoints, not by Better Auth itself.
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),

  email: z.string().trim().toLowerCase().email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .refine((v) => /[A-Z]/.test(v), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((v) => /[0-9]/.test(v), {
      message: 'Password must contain at least one number',
    })
    .refine((v) => /[^A-Za-z0-9]/.test(v), {
      message: 'Password must contain at least one special character',
    }),

  role: z.enum(['CLIENT', 'FREELANCER'] as const, {
    error: 'Role must be CLIENT or FREELANCER',
  }),
});

// ─── Login schema ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),

  password: z.string().min(1, 'Password is required'),
});

// ─── Inferred types ──────────────────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
