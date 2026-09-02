import { z } from 'zod';

export const packageDetailListItemSchema = z.object({
  value: z.string().max(500, 'Each item must be 500 characters or fewer.'),
});

export const packageDetailFormSchema = z.object({
  overview: z.string().optional(),
  destinations: z.array(packageDetailListItemSchema),
  sightseeing: z.array(packageDetailListItemSchema),
  inclusions: z.array(packageDetailListItemSchema),
  exclusions: z.array(packageDetailListItemSchema),
  highlights: z.array(packageDetailListItemSchema),
});

export type PackageDetailFormValues = z.infer<typeof packageDetailFormSchema>;
