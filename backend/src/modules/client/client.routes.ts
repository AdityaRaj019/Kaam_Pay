import { Router } from 'express';
import {
  searchGigsController,
  getGigDetailsController,
  searchFreelancersController,
  getFreelancerDetailsController,
  getCategoriesController,
} from './client.controller';

const router = Router();

/**
 * @route  GET /api/client/gigs
 * @desc   Search active gigs with optional filters (search, category, price, delivery time)
 * @access Public
 */
router.get('/gigs', searchGigsController);

/**
 * @route  GET /api/client/categories
 * @desc   Get all distinct categories from active gigs
 * @access Public
 */
router.get('/categories', getCategoriesController);

/**
 * @route  GET /api/client/gigs/:id
 * @desc   Get a single gig's full details including freelancer info
 * @access Public
 */
router.get('/gigs/:id', getGigDetailsController);

/**
 * @route  GET /api/client/freelancers
 * @desc   Search freelancers with optional filters (search, skills, hourly rate)
 * @access Public
 */
router.get('/freelancers', searchFreelancersController);

/**
 * @route  GET /api/client/freelancers/:id
 * @desc   Get a single freelancer's public profile with their active gigs
 * @access Public
 */
router.get('/freelancers/:id', getFreelancerDetailsController);

export default router;
