import type { PackageFaqFormValues } from '@/lib/admin/package-faq-form-schema';
import {
  adminApiDelete,
  adminApiGet,
  adminApiPatch,
  adminApiPost,
} from '@/lib/admin/client';

export interface AdminPackageFaq {
  id: number;
  package_id: number;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PackageFaqApiPayload = {
  question: string;
  answer: string;
  sort_order: number;
};

export function getDefaultPackageFaqFormValues(): PackageFaqFormValues {
  return {
    question: '',
    answer: '',
    sort_order: 0,
  };
}

export function adminPackageFaqToFormValues(faq: AdminPackageFaq): PackageFaqFormValues {
  return {
    question: faq.question,
    answer: faq.answer,
    sort_order: faq.sort_order,
  };
}

export function toPackageFaqPayload(values: PackageFaqFormValues): PackageFaqApiPayload {
  return {
    question: values.question.trim(),
    answer: values.answer.trim(),
    sort_order: values.sort_order,
  };
}

export function getPackageFaqs(packageId: number | string): Promise<AdminPackageFaq[]> {
  return adminApiGet<AdminPackageFaq[]>(`/admin/packages/${packageId}/faqs`);
}

export function createPackageFaq(
  packageId: number | string,
  payload: PackageFaqApiPayload
): Promise<AdminPackageFaq> {
  return adminApiPost<AdminPackageFaq, PackageFaqApiPayload>(
    `/admin/packages/${packageId}/faqs`,
    payload
  );
}

export function updatePackageFaq(
  packageId: number | string,
  faqId: number | string,
  payload: PackageFaqApiPayload
): Promise<AdminPackageFaq> {
  return adminApiPatch<AdminPackageFaq, PackageFaqApiPayload>(
    `/admin/packages/${packageId}/faqs/${faqId}`,
    payload
  );
}

export function deletePackageFaq(
  packageId: number | string,
  faqId: number | string
): Promise<{ message: string }> {
  return adminApiDelete<{ message: string }>(`/admin/packages/${packageId}/faqs/${faqId}`);
}
