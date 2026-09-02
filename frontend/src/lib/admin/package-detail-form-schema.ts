import { z } from 'zod';

const stringListField = z.array(z.string().max(500, 'Each item must be 500 characters or fewer.'));

export const packageDetailFormSchema = z.object({
  overview: z.string().optional(),
  destinations: stringListField,
  sightseeing: stringListField,
  inclusions: stringListField,
  exclusions: stringListField,
  highlights: stringListField,
});

export type PackageDetailFormValues = z.infer<typeof packageDetailFormSchema>;
