import { z } from 'zod';

// ─── Gig Search Schema ────────────────────────────────────────

export const gigSearchSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0, 'minPrice must be non-negative').optional(),
  maxPrice: z.coerce.number().min(0, 'maxPrice must be non-negative').optional(),
  deliveryTime: z.coerce.number().int().min(1, 'deliveryTime must be at least 1 day').optional(),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'newest', 'delivery_time'])
    .optional()
    .default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type GigSearchInput = z.infer<typeof gigSearchSchema>;

// ─── Freelancer Search Schema ─────────────────────────────────

export const freelancerSearchSchema = z.object({
  search: z.string().trim().optional(),
  skills: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val.split(',').map((s) => s.trim()).filter(Boolean) : undefined)),
  minRate: z.coerce.number().min(0, 'minRate must be non-negative').optional(),
  maxRate: z.coerce.number().min(0, 'maxRate must be non-negative').optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type FreelancerSearchInput = z.infer<typeof freelancerSearchSchema>;
