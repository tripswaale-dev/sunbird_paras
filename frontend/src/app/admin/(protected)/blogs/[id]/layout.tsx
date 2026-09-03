import { getAdminNumericIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getAdminNumericIdParams('/admin/blogs');
}

export default function AdminBlogIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
