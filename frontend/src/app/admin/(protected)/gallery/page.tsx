import { Suspense } from 'react';
import { GalleryItemsList } from '@/components/admin/gallery/GalleryItemsList';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gallery</h1>
          <p className="mt-2 text-sm text-gray-600">Manage gallery images for the public site.</p>
        </div>
        <Button href="/admin/gallery/new" className="rounded-lg">
          New item
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[240px] items-center justify-center">
            <Loader />
          </div>
        }
      >
        <GalleryItemsList />
      </Suspense>
    </div>
  );
}
