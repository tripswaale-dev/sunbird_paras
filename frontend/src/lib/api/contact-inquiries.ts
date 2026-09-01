import { apiPost } from '@/lib/api/client';
import type { ContactInquiryPayload, ContactInquiryResponse } from '@/lib/api/types';

export async function submitContactInquiry(
  payload: ContactInquiryPayload
): Promise<ContactInquiryResponse> {
  return apiPost<ContactInquiryResponse, ContactInquiryPayload>('/contact-inquiries', payload);
}
