import { Suspense } from 'react';
import { SectionsList } from '@/components/admin/sections/SectionsList';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

export default function AdminSectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sections</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage homepage sections, package assignments, and listing metadata.
          </p>
        </div>
        <Button href="/admin/sections/new" className="rounded-lg">
          New section
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[240px] items-center justify-center">
            <Loader />
          </div>
        }
      >
        <SectionsList />
      </Suspense>
    </div>
  );
}
