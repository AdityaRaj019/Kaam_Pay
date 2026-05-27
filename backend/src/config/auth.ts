import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { twoFactor } from 'better-auth/plugins';
import prisma from './prisma';

/**
 * Better Auth instance — the single source of truth for all authentication.
 *
 * This handles:
 *  - Email/password sign-up and sign-in
 *  - OAuth / Social login (Google, GitHub, Apple)
 *  - Two-Factor Authentication (2FA) via TOTP
 *  - Secure HTTP-only session cookies
 *  - Session lifecycle (create, validate, revoke)
 *  - Password hashing (built-in scrypt — replaces bcrypt)
 *
 * The auth instance exposes:
 *  - `auth.handler`  → use with `toNodeHandler()` to mount on Express
 *  - `auth.api`      → server-side API for session validation in middleware
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // ── Secret for signing session tokens ──────────────────────
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Base URL for the auth API ──────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',

  // ── Base path where auth endpoints are mounted ─────────────
  basePath: '/api/auth',

  // ── Email + Password authentication ────────────────────────
  emailAndPassword: {
    enabled: true,
    // Better Auth hashes passwords internally using scrypt
    // No need for manual bcrypt calls
  },

  // ── Session configuration ──────────────────────────────────
  session: {
    // How long a session lasts before it expires
    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
    // How often the session expiry is refreshed on activity
    updateAge: 60 * 60 * 24, // 1 day (in seconds)

    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes — reduces DB lookups
    },
  },

  // ── User model customization ───────────────────────────────
  user: {
    // Map additional fields from User model into the session
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CLIENT',
        input: true, // Allow setting during sign-up
      },
    },
  },

  // ── Social Providers (OAuth) ──────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'mock-github-client-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock-github-client-secret',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || 'mock-apple-client-id',
      clientSecret: process.env.APPLE_CLIENT_SECRET || 'mock-apple-client-secret',
    },
  },

  // ── Plugins ────────────────────────────────────────────────
  plugins: [
    twoFactor({
      issuer: 'KaamPay', // The issuer name shown in Authenticator Apps
    }),
  ],

  // ── Trusted origins for CORS (cookie domain) ───────────────
  trustedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(','),
});

// Export the auth type for use in middleware and route handlers
export type Auth = typeof auth;
