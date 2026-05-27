import { Request, Response } from 'express';
import { freelancerOnboardingSchema } from './user.validation';
import { UserService } from './user.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * POST /api/users/onboarding
 *
 * Handles freelancer onboarding validation and profile generation.
 * Expects the user to be authenticated (via requireAuth).
 */
export const completeFreelancerOnboarding = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = freelancerOnboardingSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await UserService.completeOnboarding(req.user.id, validation.data);

  sendSuccess(res, 200, 'Freelancer onboarding completed successfully.', result);
});
