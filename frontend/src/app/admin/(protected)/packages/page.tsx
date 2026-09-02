import { Suspense } from 'react';
import { PackagesList } from '@/components/admin/packages/PackagesList';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

export default function AdminPackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Packages</h1>
          <p className="mt-2 text-sm text-gray-600">Manage travel packages for the public site.</p>
        </div>
        <Button href="/admin/packages/new" className="rounded-lg">
          New package
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[240px] items-center justify-center">
            <Loader />
          </div>
        }
      >
        <PackagesList />
      </Suspense>
    </div>
  );
}
