import type { BlogSeo } from '@/lib/api/types';
import { adminApiGet, adminApiPatch } from '@/lib/admin/client';
import type { PageSeoFormValues } from '@/lib/admin/page-seo-form-schema';

export const PAGE_SEO_KEYS = [
  'home',
  'gallery',
  'packages',
  'search',
  'blogs',
  'about',
  'contact',
  'payment-policy',
  'cancellation-policy',
  'destinations',
] as const;

export type PageSeoKey = (typeof PAGE_SEO_KEYS)[number];

export interface PageSeoOption {
  value: PageSeoKey;
  label: string;
  path: string;
}

export const PAGE_SEO_OPTIONS: PageSeoOption[] = [
  { value: 'home', label: 'Home', path: '/' },
  { value: 'gallery', label: 'Gallery', path: '/gallery' },
  { value: 'packages', label: 'Packages', path: '/packages' },
  { value: 'search', label: 'Search', path: '/search' },
  { value: 'blogs', label: 'Blogs', path: '/blogs' },
  { value: 'about', label: 'About', path: '/about' },
  { value: 'contact', label: 'Contact', path: '/contact' },
  { value: 'payment-policy', label: 'Payment Policy', path: '/payment-policy' },
  {
    value: 'cancellation-policy',
    label: 'Cancellation Policy',
    path: '/cancellation-policy',
  },
  { value: 'destinations', label: 'Destinations', path: '/destinations' },
];

export interface AdminPageSeo {
  page_key: PageSeoKey;
  seo: BlogSeo;
}

export type PageSeoApiPayload = {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
};

export function isValidPageSeoKey(key: string): key is PageSeoKey {
  return (PAGE_SEO_KEYS as readonly string[]).includes(key);
}

export function getPageSeoOption(key: PageSeoKey): PageSeoOption {
  const option = PAGE_SEO_OPTIONS.find((item) => item.value === key);

  if (!option) {
    throw new Error(`Unknown page SEO key: ${key}`);
  }

  return option;
}

export function toPageSeoFormValues(item: AdminPageSeo): PageSeoFormValues {
  return {
    meta_title: item.seo.meta_title ?? '',
    meta_description: item.seo.meta_description ?? '',
    canonical_url: item.seo.canonical_url ?? '',
    og_image: item.seo.og_image ?? '',
    is_indexable: item.seo.is_indexable,
  };
}

export function toPageSeoPayload(values: PageSeoFormValues): PageSeoApiPayload {
  return {
    meta_title: values.meta_title?.trim() || null,
    meta_description: values.meta_description?.trim() || null,
    canonical_url: values.canonical_url?.trim() || null,
    og_image: values.og_image?.trim() || null,
    is_indexable: values.is_indexable,
  };
}

export function getPageSeo(pageKey: PageSeoKey): Promise<AdminPageSeo> {
  return adminApiGet<AdminPageSeo>(`/admin/page-seo/${pageKey}`);
}

export function updatePageSeo(
  pageKey: PageSeoKey,
  payload: PageSeoApiPayload
): Promise<AdminPageSeo> {
  return adminApiPatch<AdminPageSeo, PageSeoApiPayload>(
    `/admin/page-seo/${pageKey}`,
    payload
  );
}
