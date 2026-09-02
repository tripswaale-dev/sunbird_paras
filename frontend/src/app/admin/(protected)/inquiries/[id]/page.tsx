'use client';

import { useParams } from 'next/navigation';
import { InquiryDetailView } from '@/components/admin/inquiries/InquiryDetailView';

export default function AdminInquiryDetailPage() {
  const params = useParams();
  const id = String(params.id ?? '');

  return <InquiryDetailView id={id} />;
}
