import { z } from 'zod';

const externalIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const galleryItemCategoryValues = [
  'RAJASTHAN',
  'UTTARAKHAND',
  'HIMACHAL',
  'KASHMIR',
  'KERALA',
  'GOA',
  'LADAKH',
  'ANDAMAN',
  'INTERNATIONAL',
] as const;

export const galleryItemFormSchema = z.object({
  external_id: z
    .string()
    .min(1, 'External ID is required.')
    .regex(externalIdRegex, 'Use lowercase kebab-case.'),
  src: z.string().min(1, 'Image path or URL is required.'),
  category: z.enum(galleryItemCategoryValues),
  title: z.string().min(1, 'Title is required.'),
  subtitle: z.string().min(1, 'Subtitle is required.'),
  aspect_ratio: z.enum(['square', 'portrait', 'landscape']),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
  is_active: z.boolean(),
});

export type GalleryItemFormValues = z.infer<typeof galleryItemFormSchema>;
