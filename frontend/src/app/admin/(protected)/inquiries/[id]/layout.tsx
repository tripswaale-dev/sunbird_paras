import { getAdminNumericIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getAdminNumericIdParams('/admin/contact-inquiries');
}

export default function AdminInquiryIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
