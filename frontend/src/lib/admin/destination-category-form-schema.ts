import { z } from 'zod';

export const destinationCategoryFormSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255),
  hero_image: z.string().min(1, 'Hero image is required.').max(500),
  hero_title: z.string().min(1, 'Hero title is required.').max(255),
  hero_subtitle: z.string().max(500).optional(),
  listing_path: z.string().min(1, 'Listing path is required.').max(255),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
  is_active: z.boolean(),
});

export type DestinationCategoryFormValues = z.infer<typeof destinationCategoryFormSchema>;
