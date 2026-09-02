import type { SectionCategoryFormValues } from '@/lib/admin/section-category-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminSectionCategory {
  id: number;
  title: string;
  filter_value: string | null;
  image: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionCategoryApiPayload = {
  title: string;
  filter_value?: string | null;
  image?: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
};

export function getDefaultSectionCategoryFormValues(): SectionCategoryFormValues {
  return {
    title: '',
    filter_value: '',
    image: '',
    sort_order: 0,
    is_featured: false,
    is_active: true,
  };
}

export function adminSectionCategoryToFormValues(
  category: AdminSectionCategory
): SectionCategoryFormValues {
  return {
    title: category.title,
    filter_value: category.filter_value ?? '',
    image: category.image ?? '',
    sort_order: category.sort_order,
    is_featured: category.is_featured,
    is_active: category.is_active,
  };
}

export function toSectionCategoryPayload(
  values: SectionCategoryFormValues
): SectionCategoryApiPayload {
  return {
    title: values.title.trim(),
    filter_value: values.filter_value?.trim() || null,
    image: values.image?.trim() || null,
    sort_order: values.sort_order,
    is_featured: values.is_featured,
    is_active: values.is_active,
  };
}

export function getSectionCategories(
  sectionId: number | string
): Promise<AdminSectionCategory[]> {
  return adminApiGet<AdminSectionCategory[]>(`/admin/sections/${sectionId}/categories`);
}

export function createSectionCategory(
  sectionId: number | string,
  payload: SectionCategoryApiPayload
): Promise<AdminSectionCategory> {
  return adminApiPost<AdminSectionCategory, SectionCategoryApiPayload>(
    `/admin/sections/${sectionId}/categories`,
    payload
  );
}

export function updateSectionCategory(
  sectionId: number | string,
  categoryId: number | string,
  payload: SectionCategoryApiPayload
): Promise<AdminSectionCategory> {
  return adminApiPatch<AdminSectionCategory, SectionCategoryApiPayload>(
    `/admin/sections/${sectionId}/categories/${categoryId}`,
    payload
  );
}

export function deleteSectionCategory(
  sectionId: number | string,
  categoryId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(
    `/admin/sections/${sectionId}/categories/${categoryId}`
  );
}
