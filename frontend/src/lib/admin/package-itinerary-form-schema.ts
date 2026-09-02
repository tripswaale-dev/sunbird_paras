import { z } from 'zod';

export const packageItineraryFormSchema = z.object({
  day: z.coerce.number().int().min(1, 'Day must be at least 1.'),
  title: z.string().min(1, 'Title is required.').max(255, 'Title must be 255 characters or fewer.'),
  description: z.string().min(1, 'Description is required.'),
  stay_information: z.string().max(500, 'Stay information must be 500 characters or fewer.').optional(),
  notes: z.string().optional(),
  images: z.array(z.string().max(500, 'Each image path must be 500 characters or fewer.')),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
});

export type PackageItineraryFormValues = z.infer<typeof packageItineraryFormSchema>;
