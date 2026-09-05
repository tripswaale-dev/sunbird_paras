import { getPackageAdminIdParams } from '@/lib/build/static-params';
import AdminPackageContentClient from './content-client';

export async function generateStaticParams() {
  return getPackageAdminIdParams();
}

export default function AdminPackageContentPage() {
  return <AdminPackageContentClient />;
}
