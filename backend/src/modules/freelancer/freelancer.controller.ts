import { Request, Response } from 'express';
import { freelancerProfileUpdateSchema } from './freelancer.validation';
import { FreelancerService } from './freelancer.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * POST /api/freelancer/update
 *
 * Handles freelancer profile updates.
 * Expects the user to be authenticated and have the role FREELANCER.
 */
export const updateFreelancerProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = freelancerProfileUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const updatedProfile = await FreelancerService.updateProfile(req.user.id, validation.data);

  sendSuccess(res, 200, 'Freelancer profile updated successfully.', updatedProfile);
});
