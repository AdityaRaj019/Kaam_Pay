import { Request, Response } from 'express';
import { createGigSchema } from './gig.validation';
import { GigService } from './gig.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * POST /api/gigs/create
 *
 * Handles creating a new freelancer gig.
 * Validates request payload and invokes the GigService.
 */
export const createGig = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated.', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = createGigSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(
      `Validation failed: ${errorDetails}`,
      422,
      ErrorCode.VALIDATION_ERROR
    );
  }

  const newGig = await GigService.createGig(req.user.id, validation.data);

  sendSuccess(res, 201, 'Gig created successfully.', newGig);
});

/**
 * GET /api/gigs/my-gigs
 *
 * Retrieves all gigs created by the authenticated freelancer.
 */
export const getMyGigs = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated.', 401, ErrorCode.UNAUTHORIZED);
  }

  const gigs = await GigService.getGigsByFreelancer(req.user.id);
  sendSuccess(res, 200, 'Freelancer gigs retrieved successfully.', gigs);
});

/**
 * GET /api/gigs
 *
 * Retrieves all active gigs on the platform (public browse endpoint).
 */
export const getAllGigs = catchAsync(async (_req: Request, res: Response) => {
  const gigs = await GigService.getAllActiveGigs();
  sendSuccess(res, 200, 'Active gigs retrieved successfully.', gigs);
});
