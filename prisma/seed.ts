import prisma from '../backend/src/config/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kaampay.com' },
    update: {},
    create: {
      email: 'admin@kaampay.com',
      name: 'Super Admin',
      passwordHash: 'mocked_hash_admin123',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Created Admin:', admin.email);

  // 2. Create Client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'John Client',
      passwordHash: 'mocked_hash_client123',
      role: 'CLIENT',
      isVerified: true,
    },
  });
  console.log('✅ Created Client:', client.email);

  // 3. Create Freelancer with Profile
  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      email: 'freelancer@example.com',
      name: 'Jane Freelancer',
      passwordHash: 'mocked_hash_free123',
      role: 'FREELANCER',
      isVerified: true,
      profile: {
        create: {
          bio: 'Expert Full-Stack Developer with 5 years of experience.',
          skills: ['React', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL'],
          portfolioLinks: ['https://jane.dev', 'https://github.com/jane'],
          hourlyRate: 50,
        },
      },
    },
  });
  console.log('✅ Created Freelancer:', freelancer.email);

  // 4. Create Gigs for Freelancer
  const gig1 = await prisma.gig.create({
    data: {
      freelancerId: freelancer.id,
      title: 'Modern Next.js Website Development',
      description:
        'I will build a high-performance, SEO-friendly website using Next.js and Tailwind CSS.',
      category: 'Web Development',
      price: 500,
      deliveryTime: 7,
      status: 'ACTIVE',
    },
  });

  const gig2 = await prisma.gig.create({
    data: {
      freelancerId: freelancer.id,
      title: 'Database Design and Optimization',
      description: 'I will design and optimize your PostgreSQL database using Prisma ORM.',
      category: 'Databases',
      price: 300,
      deliveryTime: 3,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created 2 Gigs for Freelancer');

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
