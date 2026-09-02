import { z } from 'zod';

export const PACKAGE_IMAGE_TYPES = ['hero', 'gallery'] as const;

export const packageImageFormSchema = z.object({
  path: z.string().min(1, 'Image path is required.').max(500, 'Path must be 500 characters or fewer.'),
  type: z.enum(PACKAGE_IMAGE_TYPES, { message: 'Select hero or gallery.' }),
  alt_text: z.string().max(255, 'Alt text must be 255 characters or fewer.').optional(),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
});

export type PackageImageFormValues = z.infer<typeof packageImageFormSchema>;
