import type { SectionStatFormValues } from '@/lib/admin/section-stat-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminSectionStat {
  id: number;
  value: string;
  label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SectionStatApiPayload = {
  value: string;
  label: string;
  sort_order: number;
};

export function getDefaultSectionStatFormValues(): SectionStatFormValues {
  return {
    value: '',
    label: '',
    sort_order: 0,
  };
}

export function adminSectionStatToFormValues(stat: AdminSectionStat): SectionStatFormValues {
  return {
    value: stat.value,
    label: stat.label,
    sort_order: stat.sort_order,
  };
}

export function toSectionStatPayload(values: SectionStatFormValues): SectionStatApiPayload {
  return {
    value: values.value.trim(),
    label: values.label.trim(),
    sort_order: values.sort_order,
  };
}

export function getSectionStats(sectionId: number | string): Promise<AdminSectionStat[]> {
  return adminApiGet<AdminSectionStat[]>(`/admin/sections/${sectionId}/stats`);
}

export function createSectionStat(
  sectionId: number | string,
  payload: SectionStatApiPayload
): Promise<AdminSectionStat> {
  return adminApiPost<AdminSectionStat, SectionStatApiPayload>(
    `/admin/sections/${sectionId}/stats`,
    payload
  );
}

export function updateSectionStat(
  sectionId: number | string,
  statId: number | string,
  payload: SectionStatApiPayload
): Promise<AdminSectionStat> {
  return adminApiPatch<AdminSectionStat, SectionStatApiPayload>(
    `/admin/sections/${sectionId}/stats/${statId}`,
    payload
  );
}

export function deleteSectionStat(
  sectionId: number | string,
  statId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/sections/${sectionId}/stats/${statId}`);
}
