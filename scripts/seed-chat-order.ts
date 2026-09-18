import 'dotenv/config';
import prisma from '../backend/src/config/prisma';

async function seedChatOrder() {
  console.log('🌱 Checking users and orders for chat testing...');

  // 1. Find a client and a freelancer
  let client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
  let freelancer = await prisma.user.findFirst({ where: { role: 'FREELANCER' } });

  if (!client) {
    client = await prisma.user.create({
      data: {
        email: 'testclient@kaampay.dev',
        name: 'Demo Client',
        role: 'CLIENT',
        emailVerified: true,
      },
    });
    console.log('Created test client:', client.email);
  }

  if (!freelancer) {
    freelancer = await prisma.user.create({
      data: {
        email: 'testfreelancer@kaampay.dev',
        name: 'Demo Freelancer',
        role: 'FREELANCER',
        emailVerified: true,
      },
    });
    console.log('Created test freelancer:', freelancer.email);
  }

  console.log(`Using Client: ${client.name} (${client.id})`);
  console.log(`Using Freelancer: ${freelancer.name} (${freelancer.id})`);

  // 2. Find or create a gig for the freelancer
  let gig = await prisma.gig.findFirst({ where: { freelancerId: freelancer.id } });
  if (!gig) {
    gig = await prisma.gig.create({
      data: {
        freelancerId: freelancer.id,
        title: 'Full-Stack Next.js & Express App Development',
        description: 'Complete web application with real-time features and responsive design.',
        category: 'Web Development',
        price: 250,
        deliveryTime: 5,
        status: 'ACTIVE',
      },
    });
    console.log('Created gig:', gig.title);
  }

  // 3. Find or create an Order between this client and freelancer
  let order = await prisma.order.findFirst({
    where: {
      clientId: client.id,
      freelancerId: freelancer.id,
    },
    include: { chatRoom: true },
  });

  if (!order) {
    order = await prisma.order.create({
      data: {
        clientId: client.id,
        freelancerId: freelancer.id,
        gigId: gig.id,
        amount: gig.price,
        status: 'IN_PROGRESS',
        chatRoom: {
          create: {},
        },
      },
      include: { chatRoom: true },
    });
    console.log('Created test order:', order.id);
  } else if (!order.chatRoom) {
    await prisma.chatRoom.create({ data: { orderId: order.id } });
    order = (await prisma.order.findUnique({
      where: { id: order.id },
      include: { chatRoom: true },
    }))!;
    console.log('Created chat room for existing order:', order.id);
  } else {
    console.log('Order and chat room already exist:', order.id);
  }

  // 4. Check if messages exist in this chat room
  const chatRoomId = order.chatRoom!.id;
  const messageCount = await prisma.message.count({ where: { chatRoomId } });

  if (messageCount === 0) {
    await prisma.message.create({
      data: {
        chatRoomId,
        senderId: client.id,
        text: 'Hi! I have placed the order for the Next.js website project. Excited to work together!',
      },
    });

    await prisma.message.create({
      data: {
        chatRoomId,
        senderId: freelancer.id,
        text: 'Hello! Thank you for the order. I have received your specifications and will start working right away. Let me know if you have any asset files or color palette preferences!',
      },
    });
    console.log('Added initial welcome messages to chat room ✅');
  } else {
    console.log(`Chat room already has ${messageCount} messages.`);
  }

  console.log('\n🎉 Ready for testing!');
  console.log(`Order ID: ${order.id}`);
  console.log(`Chat URL: http://localhost:3000/messages?orderId=${order.id}`);
}

seedChatOrder()
  .catch((err) => {
    console.error('Failed to seed chat order:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
