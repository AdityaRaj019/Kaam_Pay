import { PrismaClient } from '../../../lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma v7 — Singleton with Adaptive Connection Handler.
 *
 * Dynamically selects transport based on DATABASE_URL in .env:
 * - If DATABASE_URL starts with `prisma://` or `prisma+postgres://`: Uses Prisma Accelerate HTTP transport.
 * - Otherwise (`postgresql://` or `postgres://`): Uses Direct PostgreSQL Driver Adapter (@prisma/adapter-pg).
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof buildPrisma>;
};

function buildPrisma() {
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
    }).$extends(withAccelerate());
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

