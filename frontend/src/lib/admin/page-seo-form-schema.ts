import { z } from 'zod';

export const pageSeoFormSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z
    .string()
    .url('Enter a valid URL.')
    .optional()
    .or(z.literal('')),
  og_image: z.string().max(500, 'OG image must be 500 characters or fewer.').optional(),
  is_indexable: z.boolean(),
});

export type PageSeoFormValues = z.infer<typeof pageSeoFormSchema>;
