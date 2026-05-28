import prisma from '../../config/prisma';
import { AppError } from '../../error/AppError';
import { FreelancerProfileUpdateInput } from './freelancer.validation';

export class FreelancerService {
  /**
   * Updates a freelancer's profile details.
   * Ensures the user exists and is a FREELANCER.
   */
  static async updateProfile(userId: string, data: FreelancerProfileUpdateInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.role !== 'FREELANCER') {
      throw new AppError('Only freelancers can update their freelancer profile.', 403);
    }

    if (!user.profile) {
      throw new AppError('Freelancer profile does not exist. Please complete onboarding first.', 400);
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        skills: data.skills !== undefined ? data.skills : undefined,
        resumeUrl: data.resumeUrl !== undefined ? (data.resumeUrl === '' ? null : data.resumeUrl) : undefined,
        hourlyRate: data.hourlyRate !== undefined ? data.hourlyRate : undefined,
      },
    });

    return updatedProfile;
  }
}
