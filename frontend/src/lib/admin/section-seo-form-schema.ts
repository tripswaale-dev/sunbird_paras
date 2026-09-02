import { z } from 'zod';

export const sectionSeoFormSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z.string().max(500, 'Canonical URL must be 500 characters or fewer.').optional(),
  og_image: z.string().max(500, 'OG image must be 500 characters or fewer.').optional(),
  is_indexable: z.boolean(),
});

export type SectionSeoFormValues = z.infer<typeof sectionSeoFormSchema>;
