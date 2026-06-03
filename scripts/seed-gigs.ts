/**
 * scripts/seed-gigs.ts
 *
 * Seeds the database with:
 *   - 3 extra FREELANCER users with full profiles
 *   - 10 realistic gigs across KaamPay PRD categories
 *
 * Run: npx tsx scripts/seed-gigs.ts
 *
 * Based on PRD §6.3 FR-3.2 Gig Categories:
 *   Video & Animation, Graphic Design, Writing & Content,
 *   Digital Marketing, Programming & Tech, Tutoring & Education,
 *   Traditional Skills, Music & Audio, Photography, Business Services
 */

// Dotenv must be first
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma';

// ─── Prisma client (same pattern as backend/src/config/prisma.ts) ─────────────

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simple hash placeholder — Better Auth uses its own hashing, but we need a
 *  valid bcrypt hash for the account record. We'll use Better Auth's createUser. */
function fakeHash(s: string) {
  // A realistic-looking bcrypt hash for test data (won't match the password)
  return `$2b$12$${Buffer.from(s).toString('base64').substring(0, 22)}AAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

interface FreelancerSeed {
  name: string;
  email: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  experience: string;
  education: string;
}

const FREELANCERS: FreelancerSeed[] = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@kaampay.dev',
    title: 'Graphic Designer & Brand Identity Specialist',
    bio: 'B.Des graduate from NID Ahmedabad. I create stunning brand identities, logos, and social media assets that help Indian businesses stand out. Worked with 40+ local brands across Rajasthan and Gujarat.',
    skills: [
      'Adobe Illustrator',
      'Figma',
      'Logo Design',
      'Social Media Graphics',
      'Typography',
      'Brand Identity',
    ],
    hourlyRate: 850,
    experience: '3 years',
    education: 'B.Des, National Institute of Design, Ahmedabad',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@kaampay.dev',
    title: 'Full Stack Developer & Tech Educator',
    bio: 'NIT Trichy CS graduate. I build responsive websites, fix bugs, and teach programming to college students. Specialise in React, Node.js, and Python. Based in Indore — available for remote gigs.',
    skills: [
      'React',
      'Node.js',
      'Python',
      'MongoDB',
      'TypeScript',
      'Next.js',
      'Bug Fixing',
      'Tutoring',
    ],
    hourlyRate: 1200,
    experience: '4 years',
    education: 'B.Tech CS, NIT Trichy',
  },
  {
    name: 'Anjali Gupta',
    email: 'anjali.gupta@kaampay.dev',
    title: 'Content Writer & Digital Marketer',
    bio: 'Freelance content writer and social media strategist from Lucknow. I write SEO-optimised blog posts, product descriptions, and manage Instagram/Facebook pages for small businesses and startups.',
    skills: [
      'SEO Writing',
      'Blog Posts',
      'Copywriting',
      'Social Media Management',
      'Instagram Marketing',
      'Hindi Content',
    ],
    hourlyRate: 600,
    experience: '2 years',
    education: 'BA English, Lucknow University',
  },
];

interface GigSeed {
  freelancerEmail: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  images: string[];
}

const GIGS: GigSeed[] = [
  // ── Video & Animation ──────────────────────────────────────────────────────
  {
    freelancerEmail: 'chai@gmail.com', // existing user: chai fill (Video editor title)
    title: 'Professional Video Editing for Reels & YouTube Shorts',
    description:
      "I will professionally edit your raw footage into a polished, viral-ready Reel or YouTube Short. Services include:\n\n• Color grading & correction\n• Background music (royalty-free)\n• Captions & subtitles (Hindi/English)\n• Transitions and cuts optimised for engagement\n• Up to 60 seconds output\n\nPerfect for small businesses, influencers, and students. Delivery in 2 days. 1 free revision included. Send me your raw footage and I'll handle the rest.",
    category: 'Video & Animation',
    price: 499,
    deliveryTime: 2,
    images: [],
  },
  {
    freelancerEmail: 'chai@gmail.com',
    title: 'Animated Explainer Video for Your Product or Business',
    description:
      'I will create a 30–60 second animated explainer video that clearly communicates your business idea, product, or service.\n\nIncludes:\n• Custom 2D motion graphics\n• Voiceover synchronisation (your audio or I source one)\n• Script review and refinement\n• Logo animation intro\n• Final export in 1080p MP4\n\nIdeal for: app launches, startup pitches, social media ads, crowdfunding campaigns. Great for explaining complex products simply.',
    category: 'Video & Animation',
    price: 1499,
    deliveryTime: 5,
    images: [],
  },

  // ── Graphic Design ────────────────────────────────────────────────────────
  {
    freelancerEmail: 'priya.sharma@kaampay.dev',
    title: 'Minimalist Logo Design with Brand Identity Kit',
    description:
      "I will design a clean, modern, and memorable logo for your business, brand, or personal brand.\n\nDeliverables:\n• 3 initial concepts to choose from\n• Final logo in all formats: PNG, SVG, PDF, AI\n• Full colour palette (primary + secondary + accents)\n• Typography selection guide\n• Business card mockup\n• Social media profile kit (profile pic + cover photo)\n\nI focus on Indian aesthetics blended with modern minimalism. I've designed logos for restaurants, clothing brands, tutoring centres, and local shops. Tell me your brand story and I'll create the perfect identity.",
    category: 'Graphic Design',
    price: 999,
    deliveryTime: 4,
    images: [],
  },
  {
    freelancerEmail: 'priya.sharma@kaampay.dev',
    title: '30 Days of Social Media Post Templates (Canva & Illustrator)',
    description:
      'I will design 30 fully customisable, on-brand social media post templates for Instagram, Facebook, and LinkedIn.\n\nIncludes:\n• 30 unique post designs (mix of carousel, single post, story)\n• Your brand colours, fonts, and logo integrated\n• Editable in Canva (free plan compatible) or Adobe Illustrator\n• 10 story templates as bonus\n• Content calendar suggestions\n\nPerfect for small businesses, coaches, restaurants, and creators who want a professional social media presence without hiring a full-time designer every month.',
    category: 'Graphic Design',
    price: 1299,
    deliveryTime: 5,
    images: [],
  },

  // ── Writing & Content ──────────────────────────────────────────────────────
  {
    freelancerEmail: 'anjali.gupta@kaampay.dev',
    title: 'SEO-Optimised Blog Post (1000–1500 words)',
    description:
      "I will write a thoroughly researched, SEO-optimised blog post for your website or business.\n\nWhat's included:\n• Keyword research (primary + 3 LSI keywords)\n• Well-structured article with H1, H2, H3 headings\n• Meta title and meta description\n• Internal link suggestions\n• Plagiarism-free content (Copyscape checked)\n• Engaging intro and strong CTA\n• Delivered in Google Doc format\n\nI write for industries: tech, lifestyle, education, food, fashion, finance, and local business. Both Hindi and English available. 1 revision included.",
    category: 'Writing & Content',
    price: 699,
    deliveryTime: 3,
    images: [],
  },
  {
    freelancerEmail: 'anjali.gupta@kaampay.dev',
    title: 'Professional Resume & LinkedIn Profile Writing',
    description:
      'I will write a powerful resume and optimise your LinkedIn profile to help you land more interviews.\n\nPackage includes:\n• ATS-optimised resume (modern template)\n• Professional summary / objective statement\n• Achievement-focused bullet points (quantified results)\n• Skills section with industry keywords\n• LinkedIn profile rewrite (headline, about, experience)\n• Cover letter template (bonus)\n\nSpecialise in: fresher/entry-level, IT professionals, content creators, and marketing roles. Deliver within 3 days with 2 free rounds of edits.',
    category: 'Writing & Content',
    price: 849,
    deliveryTime: 3,
    images: [],
  },

  // ── Digital Marketing ──────────────────────────────────────────────────────
  {
    freelancerEmail: 'anjali.gupta@kaampay.dev',
    title: 'Instagram & Facebook Page Management (1 Week)',
    description:
      'I will manage your Instagram and Facebook business pages for 1 full week, handling content, engagement, and growth.\n\nIncludes:\n• 7 posts (3 Instagram feed + 4 stories/reels per platform)\n• Branded graphic creation for each post\n• Captions in Hindi/English\n• Hashtag research (30 relevant tags per post)\n• Comment and DM engagement (2x daily)\n• End-of-week analytics report\n\nPerfect for local businesses, restaurants, boutiques, and startups who want to test social media management before committing to a monthly plan.',
    category: 'Digital Marketing',
    price: 1999,
    deliveryTime: 7,
    images: [],
  },

  // ── Programming & Tech ────────────────────────────────────────────────────
  {
    freelancerEmail: 'rahul.verma@kaampay.dev',
    title: 'Responsive Landing Page (HTML, CSS, JS or Next.js)',
    description:
      'I will build a beautiful, fast, and fully responsive landing page for your business, startup, or personal brand.\n\nTech stack options:\n• Pure HTML/CSS/JS (no framework)\n• React or Next.js\n• With or without contact form\n\nIncludes:\n• Hero section with CTA\n• Features/services section\n• About section\n• Testimonials\n• Contact form (functional with EmailJS)\n• SEO meta tags\n• Mobile-first responsive design\n• Deployed to Vercel or Netlify (free tier)\n\n1 round of revision. Source code delivered via GitHub.',
    category: 'Programming & Tech',
    price: 2499,
    deliveryTime: 5,
    images: [],
  },
  {
    freelancerEmail: 'rahul.verma@kaampay.dev',
    title: 'Python or JavaScript Bug Fixing & Code Review',
    description:
      'I will debug and fix issues in your Python or JavaScript (Node.js/React) codebase, and deliver a clear explanation of what was wrong.\n\nWhat I offer:\n• Identify root cause of bugs\n• Fix the issue with clean, commented code\n• Explain what was causing the problem in plain English\n• Code review with improvement suggestions\n• Support for: APIs, database queries, React state issues, async/await errors, TypeScript type errors\n\nResponse within 2 hours for urgent fixes. Great for students, junior developers, and non-technical founders who have inherited a broken codebase.',
    category: 'Programming & Tech',
    price: 799,
    deliveryTime: 1,
    images: [],
  },

  // ── Tutoring & Education ──────────────────────────────────────────────────
  {
    freelancerEmail: 'rahul.verma@kaampay.dev',
    title: 'One-on-One Programming Tutoring Session (1 Hour, Zoom)',
    description:
      'I will teach you programming in a personalised 1-hour online session tailored to your level and goals.\n\nTopics I can teach:\n• Python (basics to intermediate)\n• JavaScript and React\n• HTML & CSS (web fundamentals)\n• Data Structures & Algorithms (DSA for placements)\n• Interview preparation\n\nWho this is for:\n• College students learning to code\n• Beginners wanting to start their tech journey\n• Students preparing for campus placements\n• Working professionals upskilling\n\nAfter the session, I share notes, resources, and a practice problem set. Hindi or English medium.',
    category: 'Tutoring & Education',
    price: 499,
    deliveryTime: 1,
    images: [],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 KaamPay Gig Seeder starting…\n');

  // ── Step 1: Upsert extra freelancer users ──────────────────────────────────
  const freelancerIds: Record<string, string> = {};

  // Load the existing freelancer first
  const existing = await prisma.user.findUnique({ where: { email: 'chai@gmail.com' } });
  if (!existing) {
    console.error(
      '❌ Existing freelancer (chai@gmail.com) not found. Run the app and register first.',
    );
    process.exit(1);
  }
  freelancerIds['chai@gmail.com'] = existing.id;
  console.log(`✅ Found existing freelancer: ${existing.name} (${existing.id})`);

  for (const f of FREELANCERS) {
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: f.email } });

    if (!user) {
      // Create freelancer user
      user = await prisma.user.create({
        data: {
          id: crypto.randomUUID().replace(/-/g, '').substring(0, 32),
          name: f.name,
          email: f.email,
          emailVerified: true,
          role: 'FREELANCER',
        },
      });
      console.log(`✅ Created user: ${f.name} (${user.id})`);
    } else {
      console.log(`⏭️  User already exists: ${f.name}`);
    }

    freelancerIds[f.email] = user.id;

    // Upsert profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        title: f.title,
        bio: f.bio,
        skills: f.skills,
        hourlyRate: f.hourlyRate,
        experience: f.experience,
        education: f.education,
      },
      create: {
        userId: user.id,
        title: f.title,
        bio: f.bio,
        skills: f.skills,
        hourlyRate: f.hourlyRate,
        experience: f.experience,
        education: f.education,
      },
    });
    console.log(`   📋 Profile upserted for ${f.name}`);
  }

  console.log('\n── Seeding Gigs ──────────────────────────────────────────────');

  // ── Step 2: Create gigs ────────────────────────────────────────────────────
  let created = 0;
  let skipped = 0;

  for (const g of GIGS) {
    const freelancerId = freelancerIds[g.freelancerEmail];
    if (!freelancerId) {
      console.warn(`⚠️  No user found for email: ${g.freelancerEmail} — skipping gig "${g.title}"`);
      skipped++;
      continue;
    }

    // Check if identical gig already exists (title + freelancer)
    const existing = await prisma.gig.findFirst({
      where: { title: g.title, freelancerId },
    });

    if (existing) {
      console.log(`⏭️  Gig already exists: "${g.title}"`);
      skipped++;
      continue;
    }

    const gig = await prisma.gig.create({
      data: {
        freelancerId,
        title: g.title,
        description: g.description,
        category: g.category,
        price: g.price,
        deliveryTime: g.deliveryTime,
        status: 'ACTIVE',
        images: g.images,
      },
    });

    console.log(
      `✅ Created: [${g.category}] "${g.title}" — ₹${g.price} — ${g.deliveryTime}d (${gig.id})`,
    );
    created++;
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(`🎉 Seeding complete!`);
  console.log(`   • Gigs created : ${created}`);
  console.log(`   • Skipped      : ${skipped}`);
  console.log(`   • Total gigs   : ${created + skipped}`);
  console.log('══════════════════════════════════════════════\n');
  console.log('🌐 Visit http://localhost:3000/find-work to see them!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
