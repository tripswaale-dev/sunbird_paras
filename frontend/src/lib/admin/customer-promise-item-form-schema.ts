import { z } from 'zod';

export const customerPromiseItemFormSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255),
  description: z.string().min(1, 'Description is required.'),
  icon: z.enum(['headphones', 'alarm-clock', 'handshake', 'users']),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be 0 or greater.'),
  is_active: z.boolean(),
});

export type CustomerPromiseItemFormValues = z.infer<typeof customerPromiseItemFormSchema>;
