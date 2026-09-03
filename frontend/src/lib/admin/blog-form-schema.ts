import { z } from 'zod';
import type { BlogContentBlock } from '@/lib/blog-content-blocks';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const headingBlockSchema = z.object({
  type: z.literal('heading'),
  text: z.string().min(1, 'Heading text is required.'),
});

const subheadingBlockSchema = z.object({
  type: z.literal('subheading'),
  text: z.string().min(1, 'Subheading text is required.'),
});

const paragraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string().min(1, 'Paragraph text is required.'),
});

const imageBlockSchema = z.object({
  type: z.literal('image'),
  image: z.string().min(1, 'Image path or URL is required.'),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const blogContentBlockSchema = z.discriminatedUnion('type', [
  headingBlockSchema,
  subheadingBlockSchema,
  paragraphBlockSchema,
  imageBlockSchema,
]);

export const blogFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(slugRegex, 'Use lowercase kebab-case.'),
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  content_blocks: z
    .array(blogContentBlockSchema)
    .min(1, 'Add at least one content block.'),
  author: z.string().min(1, 'Author is required.'),
  category: z.string().min(1, 'Category is required.'),
  image: z.string().min(1, 'Image path or URL is required.'),
  published_at: z.string().min(1, 'Published date is required.'),
  read_time_label: z.string().min(1, 'Read time label is required.'),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  canonical_url: z
    .string()
    .url('Enter a valid URL.')
    .optional()
    .or(z.literal('')),
  og_image: z.string().optional(),
  is_indexable: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export type BlogFormContentBlock = BlogContentBlock;
