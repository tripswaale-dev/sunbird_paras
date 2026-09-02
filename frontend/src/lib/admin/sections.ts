import type { SectionFormValues } from '@/lib/admin/section-form-schema';
import { slugifyTitle } from '@/lib/admin/blogs';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminSection {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  view_all_path: string;
  hero_image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionApiPayload = {
  slug: string;
  title: string;
  subtitle?: string | null;
  view_all_path: string;
  hero_image?: string | null;
  sort_order: number;
  is_active: boolean;
};

export { slugifyTitle };

export function getDefaultSectionFormValues(): SectionFormValues {
  return {
    slug: '',
    title: '',
    subtitle: '',
    view_all_path: '',
    hero_image: '',
    sort_order: 0,
    is_active: true,
  };
}

export function adminSectionToFormValues(section: AdminSection): SectionFormValues {
  return {
    slug: section.slug,
    title: section.title,
    subtitle: section.subtitle ?? '',
    view_all_path: section.view_all_path,
    hero_image: section.hero_image ?? '',
    sort_order: section.sort_order,
    is_active: section.is_active,
  };
}

export function toSectionPayload(values: SectionFormValues): SectionApiPayload {
  return {
    slug: values.slug.trim(),
    title: values.title.trim(),
    subtitle: values.subtitle?.trim() || null,
    view_all_path: values.view_all_path.trim(),
    hero_image: values.hero_image?.trim() || null,
    sort_order: values.sort_order,
    is_active: values.is_active,
  };
}

export function getSections(): Promise<AdminSection[]> {
  return adminApiGet<AdminSection[]>('/admin/sections');
}

export function getSection(id: number | string): Promise<AdminSection> {
  return adminApiGet<AdminSection>(`/admin/sections/${id}`);
}

export function createSection(payload: SectionApiPayload): Promise<AdminSection> {
  return adminApiPost<AdminSection, SectionApiPayload>('/admin/sections', payload);
}

export function updateSection(
  id: number | string,
  payload: SectionApiPayload
): Promise<AdminSection> {
  return adminApiPatch<AdminSection, SectionApiPayload>(`/admin/sections/${id}`, payload);
}

export function deleteSection(id: number | string): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/sections/${id}`);
}
