import { getAdminNumericIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getAdminNumericIdParams('/admin/gallery');
}

export default function AdminGalleryIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
