import type { PackageDetailFormValues } from '@/lib/admin/package-detail-form-schema';
import { ApiError } from '@/lib/api/client';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminPackageDetail {
  id: number;
  package_id: number;
  overview: string | null;
  destinations: string[];
  sightseeing: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export type PackageDetailApiPayload = {
  overview?: string | null;
  destinations?: string[];
  sightseeing?: string[];
  inclusions?: string[];
  exclusions?: string[];
  highlights?: string[];
};

const ARRAY_FIELDS = [
  'destinations',
  'sightseeing',
  'inclusions',
  'exclusions',
  'highlights',
] as const;

function toListRows(items: string[]): { value: string }[] {
  const values = items.length > 0 ? items : [''];

  return values.map((value) => ({ value }));
}

function filterStringList(items: { value: string }[]): string[] {
  return items.map((item) => item.value.trim()).filter(Boolean);
}

export function getDefaultPackageDetailFormValues(): PackageDetailFormValues {
  return {
    overview: '',
    destinations: [{ value: '' }],
    sightseeing: [{ value: '' }],
    inclusions: [{ value: '' }],
    exclusions: [{ value: '' }],
    highlights: [{ value: '' }],
  };
}

export function adminPackageDetailToFormValues(detail: AdminPackageDetail): PackageDetailFormValues {
  return {
    overview: detail.overview ?? '',
    destinations: toListRows(detail.destinations),
    sightseeing: toListRows(detail.sightseeing),
    inclusions: toListRows(detail.inclusions),
    exclusions: toListRows(detail.exclusions),
    highlights: toListRows(detail.highlights),
  };
}

export function toPackageDetailPayload(values: PackageDetailFormValues): PackageDetailApiPayload {
  const payload: PackageDetailApiPayload = {
    overview: values.overview?.trim() || null,
  };

  for (const field of ARRAY_FIELDS) {
    payload[field] = filterStringList(values[field]);
  }

  return payload;
}

export function isPackageDetailNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export async function getPackageDetail(packageId: number | string): Promise<AdminPackageDetail> {
  return adminApiGet<AdminPackageDetail>(`/admin/packages/${packageId}/detail`);
}

export function createPackageDetail(
  packageId: number | string,
  payload: PackageDetailApiPayload
): Promise<AdminPackageDetail> {
  return adminApiPost<AdminPackageDetail, PackageDetailApiPayload>(
    `/admin/packages/${packageId}/detail`,
    payload
  );
}

export function updatePackageDetail(
  packageId: number | string,
  payload: PackageDetailApiPayload
): Promise<AdminPackageDetail> {
  return adminApiPatch<AdminPackageDetail, PackageDetailApiPayload>(
    `/admin/packages/${packageId}/detail`,
    payload
  );
}

export function deletePackageDetail(
  packageId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/packages/${packageId}/detail`);
}
