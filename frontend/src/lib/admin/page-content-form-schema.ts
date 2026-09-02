import { z } from 'zod';
import type { PageContentKey } from '@/lib/admin/page-content';

const heroFields = {
  hero_image: z.string().min(1, 'Hero image is required.').max(500),
  hero_title: z.string().min(1, 'Hero title is required.').max(255),
  hero_subtitle: z.string().max(500).optional(),
  is_active: z.boolean(),
};

export const aboutPageContentFormSchema = z.object({
  ...heroFields,
  intro_text: z.string().optional(),
  body: z.string().optional(),
});

export const contactPageContentFormSchema = z.object({
  ...heroFields,
  intro_text: z.string().optional(),
  contact_phone: z.string().max(50).optional(),
  contact_email: z.string().email('Enter a valid email.').optional().or(z.literal('')),
  contact_address: z.string().optional(),
  working_hours: z.string().optional(),
});

export type AboutPageContentFormValues = z.infer<typeof aboutPageContentFormSchema>;
export type ContactPageContentFormValues = z.infer<typeof contactPageContentFormSchema>;
export type PageContentFormValues =
  | AboutPageContentFormValues
  | ContactPageContentFormValues;

export function getPageContentFormSchema(pageKey: PageContentKey) {
  return pageKey === 'about' ? aboutPageContentFormSchema : contactPageContentFormSchema;
}
