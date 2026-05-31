import { Request, Response } from 'express';
import { gigSearchSchema, freelancerSearchSchema } from './client.validation';
import { ClientService } from './client.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { catchAsync } from '../../common/utils/catchAsync';

/**
 * GET /api/client/gigs
 *
 * Searches active gigs with optional filters.
 * Public — no authentication required.
 */
export const searchGigsController = catchAsync(async (req: Request, res: Response) => {
  const validation = gigSearchSchema.safeParse(req.query);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await ClientService.searchGigs(validation.data);
  sendSuccess(res, 200, 'Gigs retrieved successfully.', result);
});

/**
 * GET /api/client/gigs/:id
 *
 * Retrieves a single gig by ID with freelancer details.
 * Public — no authentication required.
 */
export const getGigDetailsController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new AppError('Gig ID is required.', 422, ErrorCode.VALIDATION_ERROR);
  }

  const gig = await ClientService.getGigDetails(id);
  sendSuccess(res, 200, 'Gig details retrieved successfully.', gig);
});

/**
 * GET /api/client/freelancers
 *
 * Searches freelancers with optional filters.
 * Public — no authentication required.
 */
export const searchFreelancersController = catchAsync(async (req: Request, res: Response) => {
  const validation = freelancerSearchSchema.safeParse(req.query);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 422, ErrorCode.VALIDATION_ERROR);
  }

  const result = await ClientService.searchFreelancers(validation.data);
  sendSuccess(res, 200, 'Freelancers retrieved successfully.', result);
});

/**
 * GET /api/client/freelancers/:id
 *
 * Retrieves a single freelancer's public profile.
 * Public — no authentication required.
 */
export const getFreelancerDetailsController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new AppError('Freelancer ID is required.', 422, ErrorCode.VALIDATION_ERROR);
  }

  const freelancer = await ClientService.getFreelancerDetails(id);
  sendSuccess(res, 200, 'Freelancer details retrieved successfully.', freelancer);
});

/**
 * GET /api/client/categories
 *
 * Returns all distinct categories from active gigs.
 * Public — no authentication required.
 */
export const getCategoriesController = catchAsync(async (_req: Request, res: Response) => {
  const categories = await ClientService.getCategories();
  sendSuccess(res, 200, 'Categories retrieved successfully.', categories);
});
