import { z } from 'zod';

export const sectionStatFormSchema = z.object({
  value: z.string().min(1, 'Value is required.').max(50, 'Value must be 50 characters or fewer.'),
  label: z.string().min(1, 'Label is required.').max(255, 'Label must be 255 characters or fewer.'),
  sort_order: z.coerce
    .number()
    .int('Sort order must be a whole number.')
    .min(0, 'Sort order must be 0 or greater.')
    .max(255, 'Sort order must be 255 or less.'),
});

export type SectionStatFormValues = z.infer<typeof sectionStatFormSchema>;
