import { z } from 'zod';

export const sectionCategoryFormSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255, 'Title must be 255 characters or fewer.'),
  filter_value: z.string().max(100, 'Filter value must be 100 characters or fewer.').optional(),
  image: z.string().max(500, 'Image must be 500 characters or fewer.').optional(),
  sort_order: z.coerce
    .number()
    .int('Sort order must be a whole number.')
    .min(0, 'Sort order must be 0 or greater.')
    .max(255, 'Sort order must be 255 or less.'),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export type SectionCategoryFormValues = z.infer<typeof sectionCategoryFormSchema>;
