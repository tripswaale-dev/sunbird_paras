import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(slugRegex, 'Use lowercase kebab-case.'),
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  content: z.string().min(1, 'Content is required.'),
  author: z.string().min(1, 'Author is required.'),
  category: z.string().min(1, 'Category is required.'),
  image: z.string().min(1, 'Image path or URL is required.'),
  published_at: z.string().min(1, 'Published date is required.'),
  read_time_label: z.string().min(1, 'Read time label is required.'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z
    .string()
    .url('Enter a valid URL.')
    .optional()
    .or(z.literal('')),
  og_image: z.string().optional(),
  is_indexable: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
