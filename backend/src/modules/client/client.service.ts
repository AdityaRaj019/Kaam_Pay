import prisma from '../../config/prisma';
import { Prisma } from '../../../../lib/generated/prisma';
import { AppError } from '../../error/AppError';

// ─── Filter Types ─────────────────────────────────────────────

interface GigSearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryTime?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'delivery_time';
  page: number;
  limit: number;
}

interface FreelancerSearchFilters {
  search?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  page: number;
  limit: number;
}

// ─── Service Class ────────────────────────────────────────────

export class ClientService {
  /**
   * Searches active gigs with optional filters for search term,
   * category, price range, and delivery time. Returns paginated results.
   */
  static async searchGigs(filters: GigSearchFilters) {
    const { search, category, minPrice, maxPrice, deliveryTime, sortBy, page, limit } = filters;

    // Build dynamic where clause — only ACTIVE gigs
    const where: Prisma.GigWhereInput = {
      status: 'ACTIVE',
    };

    // Full-text search on title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Maximum delivery time filter
    if (deliveryTime !== undefined) {
      where.deliveryTime = { lte: deliveryTime };
    }

    // Determine sort order
    let orderBy: Prisma.GigOrderByWithRelationInput;
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'delivery_time':
        orderBy = { deliveryTime: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const skip = (page - 1) * limit;

    const [gigs, total] = await Promise.all([
      prisma.gig.findMany({
        where,
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.gig.count({ where }),
    ]);

    return { gigs, total, page, limit };
  }

  /**
   * Fetches a single active gig by its ID, including freelancer profile details.
   * Throws 404 if the gig does not exist or is not ACTIVE.
   */
  static async getGigDetails(gigId: string) {
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            profile: {
              select: {
                title: true,
                bio: true,
                skills: true,
                hourlyRate: true,
              },
            },
          },
        },
      },
    });

    if (!gig || gig.status !== 'ACTIVE') {
      throw new AppError('Gig not found.', 404);
    }

    return gig;
  }

  /**
   * Searches freelancer users with optional filters for keywords,
   * skills, and hourly rate range. Returns paginated results.
   */
  static async searchFreelancers(filters: FreelancerSearchFilters) {
    const { search, skills, minRate, maxRate, page, limit } = filters;

    const where: Prisma.UserWhereInput = {
      role: 'FREELANCER',
    };

    // Keyword search across user name, profile title, and profile bio
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { profile: { is: { title: { contains: search, mode: 'insensitive' } } } },
        { profile: { is: { bio: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    // Build profile-level filters (skills and hourly rate)
    const profileWhere: Prisma.ProfileWhereInput = {};
    let hasProfileFilters = false;

    if (skills && skills.length > 0) {
      profileWhere.skills = { hasSome: skills };
      hasProfileFilters = true;
    }

    if (minRate !== undefined || maxRate !== undefined) {
      const rateFilter: { gte?: number; lte?: number } = {};
      if (minRate !== undefined) rateFilter.gte = minRate;
      if (maxRate !== undefined) rateFilter.lte = maxRate;
      profileWhere.hourlyRate = rateFilter;
      hasProfileFilters = true;
    }

    // Use `is` relational filter when profile field filters exist (implicitly asserts non-null),
    // otherwise use `isNot: null` to simply require a profile to exist.
    if (hasProfileFilters) {
      where.profile = { is: profileWhere };
    } else {
      where.profile = { isNot: null };
    }

    const skip = (page - 1) * limit;

    const [freelancers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          profile: {
            select: {
              title: true,
              bio: true,
              skills: true,
              hourlyRate: true,
            },
          },
          _count: {
            select: { gigs: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { freelancers, total, page, limit };
  }

  /**
   * Fetches a single freelancer's public profile, including their active gigs.
   * Throws 404 if the user does not exist or is not a FREELANCER.
   */
  static async getFreelancerDetails(freelancerId: string) {
    const freelancer = await prisma.user.findUnique({
      where: { id: freelancerId },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        role: true,
        profile: {
          select: {
            title: true,
            bio: true,
            skills: true,
            portfolioLinks: true,
            hourlyRate: true,
            experience: true,
            education: true,
          },
        },
        gigs: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            deliveryTime: true,
            images: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!freelancer || freelancer.role !== 'FREELANCER') {
      throw new AppError('Freelancer not found.', 404);
    }

    return freelancer;
  }

  /**
   * Returns all distinct categories from currently active gigs.
   */
  static async getCategories() {
    const rows = await prisma.gig.findMany({
      where: { status: 'ACTIVE' },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });

    return rows.map((row) => row.category);
  }
}
