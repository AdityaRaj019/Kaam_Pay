import { PrismaClient } from '../../../lib/generated/prisma/client';

const prisma = new (PrismaClient as unknown as { new (): PrismaClient })();

export default prisma;
