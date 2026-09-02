import type { PackageImageFormValues } from '@/lib/admin/package-image-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export type PackageImageType = 'hero' | 'gallery';

export interface AdminPackageImage {
  id: number;
  package_id: number;
  path: string;
  type: PackageImageType;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PackageImageApiPayload = {
  path: string;
  type: PackageImageType;
  alt_text?: string | null;
  sort_order: number;
};

export function getDefaultPackageImageFormValues(): PackageImageFormValues {
  return {
    path: '',
    type: 'gallery',
    alt_text: '',
    sort_order: 0,
  };
}

export function adminPackageImageToFormValues(image: AdminPackageImage): PackageImageFormValues {
  return {
    path: image.path,
    type: image.type,
    alt_text: image.alt_text ?? '',
    sort_order: image.sort_order,
  };
}

export function toPackageImagePayload(values: PackageImageFormValues): PackageImageApiPayload {
  return {
    path: values.path.trim(),
    type: values.type,
    alt_text: values.alt_text?.trim() || null,
    sort_order: values.sort_order,
  };
}

export function getPackageImages(packageId: number | string): Promise<AdminPackageImage[]> {
  return adminApiGet<AdminPackageImage[]>(`/admin/packages/${packageId}/images`);
}

export function createPackageImage(
  packageId: number | string,
  payload: PackageImageApiPayload
): Promise<AdminPackageImage> {
  return adminApiPost<AdminPackageImage, PackageImageApiPayload>(
    `/admin/packages/${packageId}/images`,
    payload
  );
}

export function updatePackageImage(
  packageId: number | string,
  imageId: number | string,
  payload: PackageImageApiPayload
): Promise<AdminPackageImage> {
  return adminApiPatch<AdminPackageImage, PackageImageApiPayload>(
    `/admin/packages/${packageId}/images/${imageId}`,
    payload
  );
}

export function deletePackageImage(
  packageId: number | string,
  imageId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(
    `/admin/packages/${packageId}/images/${imageId}`
  );
}
