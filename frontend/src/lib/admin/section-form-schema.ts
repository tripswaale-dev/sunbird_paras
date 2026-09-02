import { z } from 'zod';

export const sectionFormSchema = z.object({
  slug: z.string().min(1, 'Slug is required.').max(100, 'Slug must be 100 characters or fewer.'),
  title: z.string().min(1, 'Title is required.').max(255, 'Title must be 255 characters or fewer.'),
  subtitle: z.string().max(500, 'Subtitle must be 500 characters or fewer.').optional(),
  view_all_path: z
    .string()
    .min(1, 'View-all path is required.')
    .max(255, 'View-all path must be 255 characters or fewer.'),
  hero_image: z.string().max(500, 'Hero image must be 500 characters or fewer.').optional(),
  sort_order: z.coerce
    .number()
    .int('Sort order must be a whole number.')
    .min(0, 'Sort order must be 0 or greater.')
    .max(255, 'Sort order must be 255 or less.'),
  is_active: z.boolean(),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;
