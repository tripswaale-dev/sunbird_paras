import type { SectionSeoFormValues } from '@/lib/admin/section-seo-form-schema';
import { adminApiGet, adminApiPatch } from '@/lib/admin/client';

export interface AdminSectionSeo {
  section_id: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
  updated_at: string;
}

export type SectionSeoApiPayload = {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
};

export function toSectionSeoFormValues(seo: AdminSectionSeo): SectionSeoFormValues {
  return {
    meta_title: seo.meta_title ?? '',
    meta_description: seo.meta_description ?? '',
    canonical_url: seo.canonical_url ?? '',
    og_image: seo.og_image ?? '',
    is_indexable: seo.is_indexable,
  };
}

export function toSectionSeoPayload(values: SectionSeoFormValues): SectionSeoApiPayload {
  return {
    meta_title: values.meta_title?.trim() || null,
    meta_description: values.meta_description?.trim() || null,
    canonical_url: values.canonical_url?.trim() || null,
    og_image: values.og_image?.trim() || null,
    is_indexable: values.is_indexable,
  };
}

export function getSectionSeo(sectionId: number | string): Promise<AdminSectionSeo> {
  return adminApiGet<AdminSectionSeo>(`/admin/sections/${sectionId}/seo`);
}

export function updateSectionSeo(
  sectionId: number | string,
  payload: SectionSeoApiPayload
): Promise<AdminSectionSeo> {
  return adminApiPatch<AdminSectionSeo, SectionSeoApiPayload>(
    `/admin/sections/${sectionId}/seo`,
    payload
  );
}
