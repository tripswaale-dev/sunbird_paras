import { z } from 'zod';

export const sectionPackageAssignFormSchema = z.object({
  package_id: z.coerce
    .number({ message: 'Select a package.' })
    .int('Select a valid package.')
    .min(1, 'Select a package.'),
  display_order: z.coerce.number().int().min(0, 'Display order must be 0 or greater.'),
  is_featured: z.boolean(),
});

export const sectionPackageUpdateFormSchema = z.object({
  display_order: z.coerce.number().int().min(0, 'Display order must be 0 or greater.'),
  is_featured: z.boolean(),
});

export type SectionPackageAssignFormValues = z.infer<typeof sectionPackageAssignFormSchema>;
export type SectionPackageUpdateFormValues = z.infer<typeof sectionPackageUpdateFormSchema>;
