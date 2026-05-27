import { z } from 'zod';

export const freelancerOnboardingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Professional title must be at least 3 characters')
    .max(100, 'Professional title must be at most 100 characters'),

  bio: z
    .string()
    .trim()
    .min(10, 'Biography must be at least 10 characters')
    .max(2000, 'Biography must be at most 2000 characters'),

  skills: z
    .array(z.string().trim().min(1, 'Skill cannot be empty'))
    .min(1, 'Please select at least one skill')
    .max(30, 'You can select at most 30 skills'),

  hourlyRate: z
    .number()
    .min(5, 'Hourly rate must be at least $5')
    .max(1000, 'Hourly rate cannot exceed $1000'),

  experience: z.enum(['newbie', 'worked_earlier', 'working'] as const, {
    message: 'Please select a valid experience level',
  }),

  purpose: z.enum(['money', 'experience', 'full_time', 'side_business'] as const, {
    message: 'Please select a valid purpose',
  }),
});

export type FreelancerOnboardingInput = z.infer<typeof freelancerOnboardingSchema>;
