import type { PackageFormValues } from '@/lib/admin/package-form-schema';
import { slugifyTitle } from '@/lib/admin/blogs';
import {
  adminApiDelete,
  adminApiGet,
  adminApiGetPaginated,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';
import type { AdminPaginatedResult } from '@/lib/admin/pagination';

export interface AdminPackageDuration {
  nights: number;
  days: number;
  formatted: string;
}

export interface AdminPackage {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  price: number;
  duration: AdminPackageDuration;
  category: string | null;
  tag: string | null;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackagesListParams {
  search?: string;
  category?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export type PackageApiPayload = {
  slug: string;
  title: string;
  subtitle?: string | null;
  location?: string | null;
  price: number;
  duration_nights: number;
  duration_days: number;
  category?: string | null;
  tag?: string | null;
  image: string;
  is_active: boolean;
};

export { slugifyTitle };

export function formatPackagePrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function adminPackageToFormValues(pkg: AdminPackage): PackageFormValues {
  return {
    slug: pkg.slug,
    title: pkg.title,
    subtitle: pkg.subtitle ?? '',
    location: pkg.location ?? '',
    price: pkg.price,
    duration_nights: pkg.duration.nights,
    duration_days: pkg.duration.days,
    category: pkg.category ?? '',
    tag: pkg.tag ?? '',
    image: pkg.image,
    is_active: pkg.is_active,
  };
}

export function toPackagePayload(values: PackageFormValues): PackageApiPayload {
  return {
    slug: values.slug,
    title: values.title,
    subtitle: values.subtitle?.trim() || null,
    location: values.location?.trim() || null,
    price: values.price,
    duration_nights: values.duration_nights,
    duration_days: values.duration_days,
    category: values.category?.trim() || null,
    tag: values.tag?.trim() || null,
    image: values.image,
    is_active: values.is_active,
  };
}

export function getDefaultPackageFormValues(): PackageFormValues {
  return {
    slug: '',
    title: '',
    subtitle: '',
    location: '',
    price: 0,
    duration_nights: 0,
    duration_days: 0,
    category: '',
    tag: '',
    image: '',
    is_active: true,
  };
}

export { applyApiErrors } from '@/lib/admin/form-errors';

function buildPackagesQuery(params: PackagesListParams): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.category?.trim()) {
    searchParams.set('category', params.category.trim());
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

export function getPackages(
  params: PackagesListParams = {}
): Promise<AdminPaginatedResult<AdminPackage>> {
  const query = buildPackagesQuery(params);

  return adminApiGetPaginated<AdminPackage>(`/admin/packages${query}`);
}

export function getPackage(id: number | string): Promise<AdminPackage> {
  return adminApiGet<AdminPackage>(`/admin/packages/${id}`);
}

export function createPackage(payload: PackageApiPayload): Promise<AdminPackage> {
  return adminApiPost<AdminPackage, PackageApiPayload>('/admin/packages', payload);
}

export function updatePackage(
  id: number | string,
  payload: PackageApiPayload
): Promise<AdminPackage> {
  return adminApiPatch<AdminPackage, PackageApiPayload>(`/admin/packages/${id}`, payload);
}

export function deletePackage(id: number | string): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/packages/${id}`);
}
