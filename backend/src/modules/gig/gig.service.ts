import prisma from '../../config/prisma';
import cloudinary from '../../config/cloudinary';
import { AppError } from '../../error/AppError';
import { CreateGigInput } from './gig.validation';

export class GigService {
  /**
   * Uploads a base64 image string to Cloudinary.
   */
  private static async uploadToCloudinary(base64Str: string): Promise<string> {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new AppError(
        'Cloudinary credentials are not configured in the backend .env file.',
        500
      );
    }

    try {
      const uploadResponse = await cloudinary.uploader.upload(base64Str, {
        folder: 'kaampay-gigs',
        resource_type: 'image',
      });
      return uploadResponse.secure_url;
    } catch (err: unknown) {
      console.error('Cloudinary Upload Error:', err);
      const message = err instanceof Error ? err.message : String(err);
      throw new AppError(
        `Failed to upload image to Cloudinary: ${message}`,
        500
      );
    }
  }

  /**
   * Creates a new freelancer gig.
   * Ensures the user is a freelancer, uploads images, and stores data in PostgreSQL.
   */
  static async createGig(freelancerId: string, data: CreateGigInput) {
    // 1. Fetch user to verify identity and role
    const user = await prisma.user.findUnique({
      where: { id: freelancerId },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.role !== 'FREELANCER') {
      throw new AppError('Only freelancers can create gigs.', 403);
    }

    // 2. Upload all images to Cloudinary in parallel
    const uploadPromises = data.images.map((img) => this.uploadToCloudinary(img));
    const imageUrls = await Promise.all(uploadPromises);

    // 3. Persist gig details in the database
    const newGig = await prisma.gig.create({
      data: {
        freelancerId,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        deliveryTime: data.deliveryTime,
        images: imageUrls,
      },
    });

    return newGig;
  }

  /**
   * Fetches all gigs created by a specific freelancer.
   */
  static async getGigsByFreelancer(freelancerId: string) {
    return prisma.gig.findMany({
      where: { freelancerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Fetches all active gigs across the platform.
   */
  static async getAllActiveGigs() {
    return prisma.gig.findMany({
      where: { status: 'ACTIVE' },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
