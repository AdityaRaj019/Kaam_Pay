import { z } from 'zod';

export const freelancerProfileUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title must not exceed 100 characters').optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters long').max(2000, 'Bio must not exceed 2000 characters').optional(),
  skills: z.array(z.string()).min(1, 'Please select at least one skill').optional(),
  resumeUrl: z.string().url('Invalid Resume URL').or(z.literal('')).nullable().optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be non-negative').optional(),
});

export type FreelancerProfileUpdateInput = z.infer<typeof freelancerProfileUpdateSchema>;
