import { getPackageAdminIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getPackageAdminIdParams();
}

export default function AdminPackageIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
