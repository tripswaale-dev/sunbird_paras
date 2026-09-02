import { PackageForm } from '@/components/admin/packages/PackageForm';
import { getDefaultPackageFormValues } from '@/lib/admin/packages';

export default function AdminPackageNewPage() {
  return <PackageForm mode="create" defaultValues={getDefaultPackageFormValues()} />;
}
