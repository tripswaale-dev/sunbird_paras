'use client';

import { useCallback } from 'react';
import { PackageList } from '@/components/sections/packages/PackageList';
import { EmptyState } from '@/components/common/EmptyState';
import { HeroBanner } from '@/components/common/HeroBanner';
import { CarouselSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import { getPackagesIndexListingPackages } from '@/lib/api/packages';
import { navbarDestinations } from '@/data/navigation';
import type { TravelPackage } from '@/data/travelPackages';

async function fetchPackagesPage(): Promise<TravelPackage[]> {
  return getPackagesIndexListingPackages();
}

export default function PackagesPage() {
  const fetcher = useCallback(() => fetchPackagesPage(), []);
  const { data: packages, isLoading } = useApiData<TravelPackage[]>(fetcher, []);

  return (
    <>
      <HeroBanner
        image="/images/hero/travel-your-way.png"
        title="Explore By Destination"
        subtitle="Discover our handpicked selection of premium tour packages across various magnificent destinations."
      />

      {isLoading ? (
        <section className="bg-gray-50 min-h-screen py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CarouselSkeleton count={6} />
          </div>
        </section>
      ) : packages.length > 0 ? (
        <PackageList
          packages={packages}
          categories={navbarDestinations}
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
