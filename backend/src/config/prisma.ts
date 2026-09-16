import { PrismaClient } from '../../../lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma v7 — Singleton with Adaptive Connection Handler.
 *
 * Dynamically selects transport based on DATABASE_URL in .env:
 * - If DATABASE_URL starts with `prisma://` or `prisma+postgres://`: Uses Prisma Accelerate HTTP transport.
 * - Otherwise (`postgresql://` or `postgres://`): Uses Direct PostgreSQL Driver Adapter (@prisma/adapter-pg).
 *
 * Type strategy:
 * The Accelerate-extended client adds optional `cacheStrategy` params to
 * every query method. When `buildPrisma()` had two return branches returning
 * different types (extended vs. base), TypeScript inferred a union — making
 * every query method uncallable because the overload signatures from each
 * branch were structurally incompatible.
 *
 * Fix: We annotate the return type as `PrismaClient` explicitly. Both
 * branches produce objects that satisfy the base PrismaClient interface,
 * and no consumer in this codebase uses Accelerate-specific cache strategy
 * params. The extended client is a strict superset, so the cast from the
 * Accelerate branch is safe — it only narrows away optional cache params
 * that are unused.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function buildPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('❌ DATABASE_URL is not set. Check your .env file.');
  }

  // Handle Prisma Accelerate connection
  if (
    connectionString.startsWith('prisma://') ||
    connectionString.startsWith('prisma+postgres://')
  ) {
    return new PrismaClient({
      accelerateUrl: connectionString,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  }

  // Handle Direct PostgreSQL connection via Driver Adapter
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Singleton instance — prevents multiple instances during tsx watch hot-reloads
const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
