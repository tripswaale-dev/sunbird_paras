import type { BlogFormValues } from '@/lib/admin/blog-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiGetPaginated,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import type { AdminPaginatedResult } from '@/lib/admin/pagination';
import {
  contentBlocksFromLegacyContent,
  type BlogContentBlock,
} from '@/lib/blog-content-blocks';

export interface AdminBlog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  content_blocks: BlogContentBlock[];
  author: string;
  category: string;
  image: string;
  published_at: string;
  read_time_label: string;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogsListParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export type BlogApiPayload = Omit<
  BlogFormValues,
  'meta_title' | 'meta_description' | 'canonical_url' | 'og_image'
> & {
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
};

const blogDateFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
});

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatBlogDate(iso: string): string {
  return blogDateFormatter.format(new Date(iso));
}

export function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

function resolveContentBlocks(blog: AdminBlog): BlogContentBlock[] {
  if (blog.content_blocks?.length) {
    return blog.content_blocks;
  }

  return contentBlocksFromLegacyContent(blog.content);
}

export function adminBlogToFormValues(blog: AdminBlog): BlogFormValues {
  return {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content_blocks: resolveContentBlocks(blog),
    author: blog.author,
    category: blog.category,
    image: blog.image,
    published_at: toDateInputValue(blog.published_at),
    read_time_label: blog.read_time_label,
    is_active: blog.is_active,
    meta_title: blog.meta_title ?? '',
    meta_description: blog.meta_description ?? '',
    canonical_url: blog.canonical_url ?? '',
    og_image: blog.og_image ?? '',
    is_indexable: blog.is_indexable,
  };
}

export function toBlogPayload(values: BlogFormValues): BlogApiPayload {
  return {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    content_blocks: values.content_blocks.map((block) => {
      if (block.type === 'image') {
        return {
          type: block.type,
          image: block.image,
          alt: block.alt?.trim() || undefined,
          caption: block.caption?.trim() || undefined,
        };
      }

      return {
        type: block.type,
        text: block.text.trim(),
      };
    }),
    author: values.author,
    category: values.category,
    image: values.image,
    published_at: values.published_at,
    read_time_label: values.read_time_label,
    is_active: values.is_active,
    is_indexable: values.is_indexable,
    meta_title: values.meta_title?.trim() || null,
    meta_description: values.meta_description?.trim() || null,
    canonical_url: values.canonical_url?.trim() || null,
    og_image: values.og_image?.trim() || null,
  };
}

export { applyApiErrors } from '@/lib/admin/form-errors';

function buildBlogsQuery(params: BlogsListParams): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.is_active !== undefined) {
    searchParams.set('is_active', params.is_active ? 'true' : 'false');
  }

  if (params.page && params.page > 1) {
    searchParams.set('page', String(params.page));
  }

  if (params.per_page) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export function getBlogs(params: BlogsListParams = {}): Promise<AdminPaginatedResult<AdminBlog>> {
  const query = buildBlogsQuery(params);

  return adminApiGetPaginated<AdminBlog>(`/admin/blogs${query}`);
}

export function getBlog(id: number | string): Promise<AdminBlog> {
  return adminApiGet<AdminBlog>(`/admin/blogs/${id}`);
}

export function createBlog(payload: BlogApiPayload): Promise<AdminBlog> {
  return adminApiPost<AdminBlog, BlogApiPayload>('/admin/blogs', payload);
}

export function updateBlog(id: number | string, payload: BlogApiPayload): Promise<AdminBlog> {
  return adminApiPatch<AdminBlog, BlogApiPayload>(`/admin/blogs/${id}`, payload);
}

export function deleteBlog(id: number | string): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/blogs/${id}`);
}

export function getDefaultBlogFormValues(): BlogFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    slug: '',
    title: '',
    excerpt: '',
    content_blocks: [{ type: 'paragraph', text: '' }],
    author: '',
    category: '',
    image: '',
    published_at: today,
    read_time_label: '',
    is_active: true,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_image: '',
    is_indexable: true,
  };
}
