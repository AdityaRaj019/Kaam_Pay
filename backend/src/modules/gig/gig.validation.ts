import { z } from 'zod';

export const createGigSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long')
    .max(80, 'Title cannot exceed 80 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters long')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(100, 'Price must be at least ₹100'),
  deliveryTime: z.number().min(1, 'Delivery time must be at least 1 day'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

export type CreateGigInput = z.infer<typeof createGigSchema>;
