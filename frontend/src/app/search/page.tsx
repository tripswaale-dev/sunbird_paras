import { Suspense } from 'react';
import { getSearchMetadata } from '@/lib/api/page-seo';
import { Loader } from '@/components/ui/loader';
import { SearchPageClient } from './SearchPageClient';

export async function generateMetadata() {
  return getSearchMetadata();
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[240px] items-center justify-center bg-gray-50">
          <Loader />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
