import { adminApiGet, adminApiPatch } from '@/lib/admin/client';
import type { DestinationCategoryFormValues } from '@/lib/admin/destination-category-form-schema';

export const DESTINATION_CATEGORY_CODES = [
  'popular',
  'hills',
  'beaches',
  'spiritual',
  'wildlife',
  'international',
] as const;

export type DestinationCategoryCode = (typeof DESTINATION_CATEGORY_CODES)[number];

export const DESTINATION_CATEGORY_LABELS: Record<DestinationCategoryCode, string> = {
  popular: 'Popular Destinations',
  hills: 'Hill Stations',
  beaches: 'Beaches',
  spiritual: 'Spiritual',
  wildlife: 'Wildlife',
  international: 'International',
};

export interface AdminDestinationCategory {
  code: DestinationCategoryCode;
  title: string;
  section_slug: string | null;
  package_category: string | null;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string | null;
  listing_path: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DestinationCategoryApiPayload = {
  title: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string | null;
  listing_path: string;
  sort_order: number;
  is_active: boolean;
};

export function isValidDestinationCategoryCode(code: string): code is DestinationCategoryCode {
  return (DESTINATION_CATEGORY_CODES as readonly string[]).includes(code);
}

export function getDestinationCategoryLabel(code: DestinationCategoryCode): string {
  return DESTINATION_CATEGORY_LABELS[code];
}

export function getDestinationCategoryPublicUrl(code: DestinationCategoryCode): string {
  return `/destinations?category=${code}`;
}

export function toDestinationCategoryFormValues(
  item: AdminDestinationCategory
): DestinationCategoryFormValues {
  return {
    title: item.title,
    hero_image: item.hero_image,
    hero_title: item.hero_title,
    hero_subtitle: item.hero_subtitle ?? '',
    listing_path: item.listing_path,
    sort_order: item.sort_order,
    is_active: item.is_active,
  };
}

export function toDestinationCategoryPayload(
  values: DestinationCategoryFormValues
): DestinationCategoryApiPayload {
  return {
    title: values.title.trim(),
    hero_image: values.hero_image.trim(),
    hero_title: values.hero_title.trim(),
    hero_subtitle: values.hero_subtitle?.trim() || null,
    listing_path: values.listing_path.trim(),
    sort_order: Math.trunc(values.sort_order),
    is_active: values.is_active,
  };
}

export function getDestinationCategories(): Promise<AdminDestinationCategory[]> {
  return adminApiGet<AdminDestinationCategory[]>('/admin/destination-categories');
}

export function getDestinationCategory(
  code: DestinationCategoryCode
): Promise<AdminDestinationCategory> {
  return adminApiGet<AdminDestinationCategory>(`/admin/destination-categories/${code}`);
}

export function updateDestinationCategory(
  code: DestinationCategoryCode,
  payload: DestinationCategoryApiPayload
): Promise<AdminDestinationCategory> {
  return adminApiPatch<AdminDestinationCategory, DestinationCategoryApiPayload>(
    `/admin/destination-categories/${code}`,
    payload
  );
}
