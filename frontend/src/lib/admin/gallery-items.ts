import {
  adminApiDelete,
  adminApiGet,
  adminApiGetPaginated,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';
import type { GalleryItemFormValues } from '@/lib/admin/gallery-item-form-schema';
import type { AdminPaginatedResult } from '@/lib/admin/pagination';

export type GalleryItemCategory =
  | 'RAJASTHAN'
  | 'UTTARAKHAND'
  | 'HIMACHAL'
  | 'KASHMIR'
  | 'KERALA'
  | 'GOA'
  | 'LADAKH'
  | 'ANDAMAN'
  | 'INTERNATIONAL';

export type GalleryAspectRatio = 'square' | 'portrait' | 'landscape';

export interface AdminGalleryItem {
  id: number;
  external_id: string;
  src: string;
  category: GalleryItemCategory;
  title: string;
  subtitle: string;
  aspect_ratio: GalleryAspectRatio;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItemsListParams {
  search?: string;
  category?: GalleryItemCategory;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export type GalleryItemApiPayload = GalleryItemFormValues;

export const GALLERY_CATEGORY_OPTIONS: Array<{
  value: GalleryItemCategory;
  label: string;
}> = [
  { value: 'RAJASTHAN', label: 'Rajasthan' },
  { value: 'UTTARAKHAND', label: 'Uttarakhand' },
  { value: 'HIMACHAL', label: 'Himachal' },
  { value: 'KASHMIR', label: 'Kashmir' },
  { value: 'KERALA', label: 'Kerala' },
  { value: 'GOA', label: 'Goa' },
  { value: 'LADAKH', label: 'Ladakh' },
  { value: 'ANDAMAN', label: 'Andaman' },
  { value: 'INTERNATIONAL', label: 'International' },
];

export const GALLERY_ASPECT_RATIO_OPTIONS: Array<{
  value: GalleryAspectRatio;
  label: string;
}> = [
  { value: 'square', label: 'Square' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

export function slugifyExternalId(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatGalleryCategoryLabel(code: GalleryItemCategory): string {
  return (
    GALLERY_CATEGORY_OPTIONS.find((option) => option.value === code)?.label ?? code
  );
}

export function toGalleryItemPayload(values: GalleryItemFormValues): GalleryItemApiPayload {
  return {
    ...values,
    sort_order: Number(values.sort_order),
  };
}

export function toGalleryItemFormValues(item: AdminGalleryItem): GalleryItemFormValues {
  return {
    external_id: item.external_id,
    src: item.src,
    category: item.category,
    title: item.title,
    subtitle: item.subtitle,
    aspect_ratio: item.aspect_ratio,
    sort_order: item.sort_order,
    is_active: item.is_active,
  };
}

export function getDefaultGalleryItemFormValues(): GalleryItemFormValues {
  return {
    external_id: '',
    src: '',
    category: 'RAJASTHAN',
    title: '',
    subtitle: '',
    aspect_ratio: 'landscape',
    sort_order: 0,
    is_active: true,
  };
}

function buildGalleryItemsQuery(params: GalleryItemsListParams): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.category) {
    searchParams.set('category', params.category);
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

export function getGalleryItems(
  params: GalleryItemsListParams = {}
): Promise<AdminPaginatedResult<AdminGalleryItem>> {
  const query = buildGalleryItemsQuery(params);

  return adminApiGetPaginated<AdminGalleryItem>(`/admin/gallery-items${query}`);
}

export function getGalleryItem(id: number | string): Promise<AdminGalleryItem> {
  return adminApiGet<AdminGalleryItem>(`/admin/gallery-items/${id}`);
}

export function createGalleryItem(payload: GalleryItemApiPayload): Promise<AdminGalleryItem> {
  return adminApiPost<AdminGalleryItem, GalleryItemApiPayload>(
    '/admin/gallery-items',
    payload
  );
}

export function updateGalleryItem(
  id: number | string,
  payload: GalleryItemApiPayload
): Promise<AdminGalleryItem> {
  return adminApiPatch<AdminGalleryItem, GalleryItemApiPayload>(
    `/admin/gallery-items/${id}`,
    payload
  );
}

export function deleteGalleryItem(id: number | string): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/gallery-items/${id}`);
}
