import { PrismaClient } from '../../../lib/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma v7 + Prisma Accelerate (prisma+postgres://accelerate.prisma-data.net)
 *
 * The DATABASE_URL is a Prisma Accelerate proxy URL — NOT a direct Postgres URL.
 * It must be passed as `accelerateUrl` (not as a pg.Pool connection string).
 * The withAccelerate() extension handles the HTTP transport.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof buildPrisma>;
};

function buildPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('❌ DATABASE_URL is not set. Check your .env file.');
  }

  return new PrismaClient({
    accelerateUrl: url,
  }).$extends(withAccelerate());
}

// Singleton — prevents multiple instances during tsx watch hot-reloads
const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
