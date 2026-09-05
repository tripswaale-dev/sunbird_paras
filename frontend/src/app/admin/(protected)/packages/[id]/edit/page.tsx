import { getPackageAdminIdParams } from '@/lib/build/static-params';
import AdminPackageEditClient from './edit-client';

export async function generateStaticParams() {
  return getPackageAdminIdParams();
}

export default function AdminPackageEditPage() {
  return <AdminPackageEditClient />;
}
