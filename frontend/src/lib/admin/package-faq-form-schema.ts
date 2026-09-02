import { z } from 'zod';

export const packageFaqFormSchema = z.object({
  question: z.string().min(1, 'Question is required.').max(500, 'Question must be 500 characters or fewer.'),
  answer: z.string().min(1, 'Answer is required.'),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
});

export type PackageFaqFormValues = z.infer<typeof packageFaqFormSchema>;
