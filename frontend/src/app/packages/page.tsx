'use client';

import { useCallback } from 'react';
import { PackageList } from '@/components/sections/packages/PackageList';
import { EmptyState } from '@/components/common/EmptyState';
import { CarouselSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import { getPackagesIndexListingPackages } from '@/lib/api/packages';
import { apiGet } from '@/lib/api/client';
import type { TravelPackage } from '@/data/travelPackages';
import type { DestinationCategorySummary } from '@/lib/api/types';

interface PackagesPageData {
  packages: TravelPackage[];
  categories: string[];
}

async function fetchPackagesPage(): Promise<PackagesPageData> {
  const [packages, destinations] = await Promise.all([
    getPackagesIndexListingPackages(),
    apiGet<{ categories: DestinationCategorySummary[] }>('/destinations').catch(() => ({
      categories: [] as DestinationCategorySummary[],
    })),
  ]);

  return {
    packages,
    categories: destinations.categories.map((c) => c.title),
  };
}

export default function PackagesPage() {
  const fetcher = useCallback(() => fetchPackagesPage(), []);
  const { data, isLoading } = useApiData<PackagesPageData>(fetcher, {
    packages: [],
    categories: [],
  });

  return (
    <>
      <div className="bg-primary-900 py-16 sm:py-24">
        <h1 className="text-center text-3xl font-heading font-bold text-white sm:text-5xl">
          Explore By Destination
        </h1>
        <p className="mt-3 text-center text-white/80 max-w-2xl mx-auto px-4">
          Discover our handpicked selection of premium tour packages.
        </p>
      </div>

      {isLoading ? (
        <section className="bg-gray-50 min-h-screen py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CarouselSkeleton count={6} />
          </div>
        </section>
      ) : data.packages.length > 0 ? (
        <PackageList
          packages={data.packages}
          categories={data.categories.length > 0 ? data.categories : undefined}
          baseRoute="/packages"
        />
      ) : (
        <section className="bg-gray-50 min-h-[40vh] py-10">
          <EmptyState
            message="No packages yet"
            subMessage="API offline or no packages in the database."
          />
        </section>
      )}
    </>
  );
}
