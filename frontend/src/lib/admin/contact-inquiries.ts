import { adminApiGet, adminApiGetPaginated } from '@/lib/admin/client';
import type { AdminPaginatedResult } from '@/lib/admin/pagination';

export type ContactInquirySubject = 'general' | 'booking' | 'custom' | 'support';

export interface AdminContactInquiry {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  subject: ContactInquirySubject;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiriesListParams {
  search?: string;
  subject?: ContactInquirySubject;
  page?: number;
  per_page?: number;
}

export const CONTACT_INQUIRY_SUBJECT_LABELS: Record<ContactInquirySubject, string> = {
  general: 'General Inquiry',
  booking: 'Package Booking',
  custom: 'Custom Itinerary',
  support: 'Customer Support',
};

export const CONTACT_INQUIRY_SUBJECT_OPTIONS: Array<{
  value: ContactInquirySubject;
  label: string;
}> = [
  { value: 'general', label: CONTACT_INQUIRY_SUBJECT_LABELS.general },
  { value: 'booking', label: CONTACT_INQUIRY_SUBJECT_LABELS.booking },
  { value: 'custom', label: CONTACT_INQUIRY_SUBJECT_LABELS.custom },
  { value: 'support', label: CONTACT_INQUIRY_SUBJECT_LABELS.support },
];

const inquiryDateFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatInquiryDate(iso: string): string {
  return inquiryDateFormatter.format(new Date(iso));
}

export function getContactInquirySubjectLabel(subject: ContactInquirySubject): string {
  return CONTACT_INQUIRY_SUBJECT_LABELS[subject];
}

function buildContactInquiriesQuery(params: ContactInquiriesListParams): string {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.subject) {
    searchParams.set('subject', params.subject);
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

export function getContactInquiries(
  params: ContactInquiriesListParams = {}
): Promise<AdminPaginatedResult<AdminContactInquiry>> {
  const query = buildContactInquiriesQuery(params);

  return adminApiGetPaginated<AdminContactInquiry>(`/admin/contact-inquiries${query}`);
}

export function getContactInquiry(id: number | string): Promise<AdminContactInquiry> {
  return adminApiGet<AdminContactInquiry>(`/admin/contact-inquiries/${id}`);
}
