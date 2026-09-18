import 'dotenv/config';
import prisma from '../backend/src/config/prisma';

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      chatRoom: {
        include: {
          messages: true,
        },
      },
      client: { select: { id: true, name: true, email: true } },
      freelancer: { select: { id: true, name: true, email: true } },
    },
  });
  console.log('Total orders in DB:', orders.length);
  console.log(JSON.stringify(orders, null, 2));

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log('Total users:', users.length);
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
