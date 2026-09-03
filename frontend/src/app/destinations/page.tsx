import { Suspense } from 'react';
import { getDestinationsMetadata } from '@/lib/api/page-seo';
import { Loader } from '@/components/ui/loader';
import { DestinationsPageClient } from './DestinationsPageClient';

export async function generateMetadata() {
  return getDestinationsMetadata();
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
          <Loader />
        </div>
      }
    >
      <DestinationsPageClient />
    </Suspense>
  );
}
