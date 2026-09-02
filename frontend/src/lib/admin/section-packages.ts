import type {
  SectionPackageAssignFormValues,
  SectionPackageUpdateFormValues,
} from '@/lib/admin/section-package-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminSectionPackage {
  id: number;
  slug: string;
  title: string;
  image: string;
  category: string | null;
  price: number;
  is_active: boolean;
  display_order: number;
  is_featured: boolean;
}

export type SectionPackageAssignPayload = {
  package_id: number;
  display_order: number;
  is_featured: boolean;
};

export type SectionPackageUpdatePayload = {
  display_order: number;
  is_featured: boolean;
};

export function getDefaultSectionPackageAssignFormValues(): SectionPackageAssignFormValues {
  return {
    package_id: 0,
    display_order: 0,
    is_featured: false,
  };
}

export function adminSectionPackageToUpdateFormValues(
  pkg: AdminSectionPackage
): SectionPackageUpdateFormValues {
  return {
    display_order: pkg.display_order,
    is_featured: pkg.is_featured,
  };
}

export function toSectionPackageAssignPayload(
  values: SectionPackageAssignFormValues
): SectionPackageAssignPayload {
  return {
    package_id: values.package_id,
    display_order: values.display_order,
    is_featured: values.is_featured,
  };
}

export function toSectionPackageUpdatePayload(
  values: SectionPackageUpdateFormValues
): SectionPackageUpdatePayload {
  return {
    display_order: values.display_order,
    is_featured: values.is_featured,
  };
}

export function getSectionPackages(sectionId: number | string): Promise<AdminSectionPackage[]> {
  return adminApiGet<AdminSectionPackage[]>(`/admin/sections/${sectionId}/packages`);
}

export function assignPackageToSection(
  sectionId: number | string,
  payload: SectionPackageAssignPayload
): Promise<AdminSectionPackage> {
  return adminApiPost<AdminSectionPackage, SectionPackageAssignPayload>(
    `/admin/sections/${sectionId}/packages`,
    payload
  );
}

export function updateSectionPackage(
  sectionId: number | string,
  packageId: number | string,
  payload: SectionPackageUpdatePayload
): Promise<AdminSectionPackage> {
  return adminApiPatch<AdminSectionPackage, SectionPackageUpdatePayload>(
    `/admin/sections/${sectionId}/packages/${packageId}`,
    payload
  );
}

export function removePackageFromSection(
  sectionId: number | string,
  packageId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(
    `/admin/sections/${sectionId}/packages/${packageId}`
  );
}
