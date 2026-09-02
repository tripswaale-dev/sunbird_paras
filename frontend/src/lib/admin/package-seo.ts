import type { PackageSeoFormValues } from '@/lib/admin/package-seo-form-schema';
import { adminApiGet, adminApiPatch } from '@/lib/admin/client';

export interface AdminPackageSeo {
  package_id: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
  updated_at: string;
}

export type PackageSeoApiPayload = {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
};

export function toPackageSeoFormValues(seo: AdminPackageSeo): PackageSeoFormValues {
  return {
    meta_title: seo.meta_title ?? '',
    meta_description: seo.meta_description ?? '',
    canonical_url: seo.canonical_url ?? '',
    og_image: seo.og_image ?? '',
    is_indexable: seo.is_indexable,
  };
}

export function toPackageSeoPayload(values: PackageSeoFormValues): PackageSeoApiPayload {
  return {
    meta_title: values.meta_title?.trim() || null,
    meta_description: values.meta_description?.trim() || null,
    canonical_url: values.canonical_url?.trim() || null,
    og_image: values.og_image?.trim() || null,
    is_indexable: values.is_indexable,
  };
}

export function getPackageSeo(packageId: number | string): Promise<AdminPackageSeo> {
  return adminApiGet<AdminPackageSeo>(`/admin/packages/${packageId}/seo`);
}

export function updatePackageSeo(
  packageId: number | string,
  payload: PackageSeoApiPayload
): Promise<AdminPackageSeo> {
  return adminApiPatch<AdminPackageSeo, PackageSeoApiPayload>(
    `/admin/packages/${packageId}/seo`,
    payload
  );
}
