import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const packageFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(slugRegex, 'Use lowercase kebab-case.'),
  title: z.string().min(1, 'Title is required.'),
  subtitle: z.string().optional(),
  location: z.string().optional(),
  price: z.coerce.number().int('Price must be a whole number.').min(0, 'Price must be zero or greater.'),
  duration_nights: z.coerce
    .number()
    .int('Nights must be a whole number.')
    .min(0, 'Nights must be zero or greater.'),
  duration_days: z.coerce
    .number()
    .int('Days must be a whole number.')
    .min(0, 'Days must be zero or greater.'),
  category: z.string().optional(),
  tag: z.string().optional(),
  image: z.string().min(1, 'Image path or URL is required.'),
  is_active: z.boolean(),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;
