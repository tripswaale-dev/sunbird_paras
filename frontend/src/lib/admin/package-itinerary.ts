import type { PackageItineraryFormValues } from '@/lib/admin/package-itinerary-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminPackageItineraryDay {
  id: number;
  package_id: number;
  day: number;
  title: string;
  description: string;
  stay_information: string | null;
  notes: string | null;
  images: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PackageItineraryApiPayload = {
  day: number;
  title: string;
  description: string;
  stay_information?: string | null;
  notes?: string | null;
  images?: string[];
  sort_order: number;
};

function filterImagePaths(images: string[]): string[] {
  return images.map((item) => item.trim()).filter(Boolean);
}

export function getDefaultPackageItineraryFormValues(): PackageItineraryFormValues {
  return {
    day: 1,
    title: '',
    description: '',
    stay_information: '',
    notes: '',
    images: [''],
    sort_order: 0,
  };
}

export function adminPackageItineraryToFormValues(
  day: AdminPackageItineraryDay
): PackageItineraryFormValues {
  return {
    day: day.day,
    title: day.title,
    description: day.description,
    stay_information: day.stay_information ?? '',
    notes: day.notes ?? '',
    images: day.images.length > 0 ? day.images : [''],
    sort_order: day.sort_order,
  };
}

export function toPackageItineraryPayload(
  values: PackageItineraryFormValues
): PackageItineraryApiPayload {
  return {
    day: values.day,
    title: values.title.trim(),
    description: values.description.trim(),
    stay_information: values.stay_information?.trim() || null,
    notes: values.notes?.trim() || null,
    images: filterImagePaths(values.images),
    sort_order: values.sort_order,
  };
}

export function getPackageItineraryDays(
  packageId: number | string
): Promise<AdminPackageItineraryDay[]> {
  return adminApiGet<AdminPackageItineraryDay[]>(`/admin/packages/${packageId}/itinerary`);
}

export function createPackageItineraryDay(
  packageId: number | string,
  payload: PackageItineraryApiPayload
): Promise<AdminPackageItineraryDay> {
  return adminApiPost<AdminPackageItineraryDay, PackageItineraryApiPayload>(
    `/admin/packages/${packageId}/itinerary`,
    payload
  );
}

export function updatePackageItineraryDay(
  packageId: number | string,
  itineraryId: number | string,
  payload: PackageItineraryApiPayload
): Promise<AdminPackageItineraryDay> {
  return adminApiPatch<AdminPackageItineraryDay, PackageItineraryApiPayload>(
    `/admin/packages/${packageId}/itinerary/${itineraryId}`,
    payload
  );
}

export function deletePackageItineraryDay(
  packageId: number | string,
  itineraryId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(
    `/admin/packages/${packageId}/itinerary/${itineraryId}`
  );
}
