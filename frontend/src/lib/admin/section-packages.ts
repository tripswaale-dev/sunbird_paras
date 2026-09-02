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

export interface AssignPackageToSectionsResult {
  assigned: AdminSectionPackage[];
  failed: Array<{ sectionId: number; message: string }>;
}

export interface SyncPackageSectionAssignmentsResult {
  assigned: AdminSectionPackage[];
  removed: number[];
  failed: Array<{ sectionId: number; message: string }>;
}

export function getNextSectionDisplayOrder(packages: AdminSectionPackage[]): number {
  return packages.reduce((max, pkg) => Math.max(max, pkg.display_order), -1) + 1;
}

export async function getAssignedSectionIdsForPackage(
  packageId: number,
  sections: Array<{ id: number }>
): Promise<number[]> {
  const assignments = await Promise.all(
    sections.map(async (section) => {
      const packages = await getSectionPackages(section.id);
      const isAssigned = packages.some((pkg) => pkg.id === packageId);

      return isAssigned ? section.id : null;
    })
  );

  return assignments.filter((sectionId): sectionId is number => sectionId !== null);
}

export async function syncPackageSectionAssignments(
  packageId: number,
  nextSectionIds: number[],
  previousSectionIds: number[],
  sectionTitles: Record<number, string> = {}
): Promise<SyncPackageSectionAssignmentsResult> {
  const nextIds = [...new Set(nextSectionIds)];
  const previousIds = [...new Set(previousSectionIds)];

  const toAdd = nextIds.filter((sectionId) => !previousIds.includes(sectionId));
  const toRemove = previousIds.filter((sectionId) => !nextIds.includes(sectionId));

  const assignResult = toAdd.length
    ? await assignPackageToSections(packageId, toAdd, sectionTitles)
    : { assigned: [], failed: [] };

  const removed: number[] = [];

  for (const sectionId of toRemove) {
    const sectionLabel = sectionTitles[sectionId] ?? `Section ${sectionId}`;

    try {
      await removePackageFromSection(sectionId, packageId);
      removed.push(sectionId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to remove package from section.';

      assignResult.failed.push({
        sectionId,
        message: `${sectionLabel}: ${message}`,
      });
    }
  }

  return {
    assigned: assignResult.assigned,
    removed,
    failed: assignResult.failed,
  };
}

export async function assignPackageToSections(
  packageId: number,
  sectionIds: number[],
  sectionTitles: Record<number, string> = {}
): Promise<AssignPackageToSectionsResult> {
  const assigned: AdminSectionPackage[] = [];
  const failed: AssignPackageToSectionsResult['failed'] = [];

  for (const sectionId of sectionIds) {
    const sectionLabel = sectionTitles[sectionId] ?? `Section ${sectionId}`;

    try {
      const existing = await getSectionPackages(sectionId);
      const displayOrder = getNextSectionDisplayOrder(existing);

      const result = await assignPackageToSection(sectionId, {
        package_id: packageId,
        display_order: displayOrder,
        is_featured: false,
      });

      assigned.push(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to assign package to section.';

      failed.push({
        sectionId,
        message: `${sectionLabel}: ${message}`,
      });
    }
  }

  return { assigned, failed };
}
