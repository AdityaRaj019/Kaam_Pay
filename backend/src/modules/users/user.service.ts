import prisma from '../../config/prisma';
import { AppError } from '../../error/AppError';
import { FreelancerOnboardingInput } from './user.validation';

export class UserService {
  /**
   * Complete freelancer onboarding:
   * 1. Updates User role to FREELANCER
   * 2. Upserts Profile with bio, skills, hourlyRate, title
   */
  static async completeOnboarding(userId: string, data: FreelancerOnboardingInput) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found.', 404);
      }

      // Update user role to FREELANCER
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role: 'FREELANCER' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
      });

      // Upsert user profile
      const profile = await tx.profile.upsert({
        where: { userId },
        update: {
          title: data.title,
          bio: data.bio,
          skills: data.skills,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          purpose: data.purpose,
        },
        create: {
          userId,
          title: data.title,
          bio: data.bio,
          skills: data.skills,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          purpose: data.purpose,
          portfolioLinks: [],
        },
      });

      return {
        user: updatedUser,
        profile,
      };
    });
  }
}
