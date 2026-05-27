import prisma from '../backend/src/config/prisma';

/**
 * Database Seed Script
 *
 * With Better Auth, passwords are stored in the Account table
 * (via the 'credential' provider), not directly on User.
 * This seed creates Users + linked credential Accounts.
 *
 * NOTE: In production, users should register through the auth flow.
 * This seed is only for development/testing purposes.
 */
async function main() {
  console.log('🌱 Seeding database...');

  // Helper: create a user with a credential account
  const createUserWithAccount = async (userData: {
    email: string;
    name: string;
    role: 'ADMIN' | 'CLIENT' | 'FREELANCER';
    password: string;
  }) => {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: true,
        accounts: {
          create: {
            id: `account_${userData.email.replace(/[@.]/g, '_')}`,
            accountId: userData.email,
            providerId: 'credential',
            // NOTE: This is a placeholder hash. In real usage, Better Auth
            // hashes passwords internally. For seeding, use the auth API
            // or Better Auth's hashPassword utility.
            password: userData.password,
          },
        },
      },
    });
    return user;
  };

  // 1. Create Admin
  const admin = await createUserWithAccount({
    email: 'admin@kaampay.com',
    name: 'Super Admin',
    role: 'ADMIN',
    password: 'mocked_hash_admin123',
  });
  console.log('✅ Created Admin:', admin.email);

  // 2. Create Client
  const client = await createUserWithAccount({
    email: 'client@example.com',
    name: 'John Client',
    role: 'CLIENT',
    password: 'mocked_hash_client123',
  });
  console.log('✅ Created Client:', client.email);

  // 3. Create Freelancer with Profile
  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      email: 'freelancer@example.com',
      name: 'Jane Freelancer',
      role: 'FREELANCER',
      emailVerified: true,
      accounts: {
        create: {
          id: 'account_freelancer_example_com',
          accountId: 'freelancer@example.com',
          providerId: 'credential',
          password: 'mocked_hash_free123',
        },
      },
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
  await prisma.gig.create({
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

  await prisma.gig.create({
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
