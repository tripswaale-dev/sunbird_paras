import { z } from 'zod';

export const heroChipIconEnum = z.enum(['mountain', 'umbrella', 'tree-pine', 'map-pin']);

const heroChipSchema = z.object({
  icon: heroChipIconEnum,
  label: z.string().min(1, 'Label is required.').max(255),
});

export const homepageHeroFormSchema = z
  .object({
    background_video: z.string().min(1, 'Background video path is required.').max(500),
    chips: z.array(heroChipSchema).min(1, 'At least one chip is required.'),
    featured_chip_enabled: z.boolean(),
    featured_chip_icon: heroChipIconEnum.optional(),
    featured_chip_label: z.string().max(255).optional(),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.featured_chip_enabled) {
      return;
    }

    if (!data.featured_chip_icon) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Featured chip icon is required.',
        path: ['featured_chip_icon'],
      });
    }

    if (!data.featured_chip_label?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Featured chip label is required.',
        path: ['featured_chip_label'],
      });
    }
  });

export type HomepageHeroFormValues = z.infer<typeof homepageHeroFormSchema>;
