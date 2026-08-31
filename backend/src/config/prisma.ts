import { PrismaClient } from '../../../lib/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma v7 — Connection via Prisma Accelerate (HTTP transport).
 *
 * The DATABASE_URL uses a `prisma+postgres://accelerate.prisma-data.net/...`
 * connection string which routes through Prisma's HTTP proxy.
 * We use `@prisma/extension-accelerate` which handles this transport.
 *
 * For local development with a direct PostgreSQL instance, replace the
 * DATABASE_URL with a standard `postgresql://...` connection string
 * and switch back to `@prisma/adapter-pg` if needed.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof buildPrisma>;
};

function buildPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('❌ DATABASE_URL is not set. Check your .env file.');
  }

  return new PrismaClient({
    accelerateUrl: connectionString,
  }).$extends(withAccelerate());
}

// Singleton — prevents multiple instances during tsx watch hot-reloads
const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
