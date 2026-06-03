import { PrismaClient } from '../../../lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma v7 — Direct PostgreSQL connection via Driver Adapter.
 *
 * In Prisma v7, the `url` field was removed from schema.prisma.
 * Use @prisma/adapter-pg with a connection string instead.
 * No Prisma Accelerate required for local development.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function buildPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('❌ DATABASE_URL is not set. Check your .env file.');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

// Singleton — prevents multiple instances during tsx watch hot-reloads
const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
