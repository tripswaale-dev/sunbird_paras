'use client';

import { useCallback } from 'react';
import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { EmptyState } from '@/components/common/EmptyState';
import { CarouselSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import {
  getSectionListingViewData,
  type SectionListingViewData,
} from '@/lib/api/sections';

const EMPTY: SectionListingViewData = {
  title: '',
  subtitle: '',
  heroImage: '',
  packages: [],
  categories: [],
};

interface SectionListingPageProps {
  sectionSlug: string;
  baseRoute: string;
  variant?: 'grid' | 'horizontal';
  withCategories?: boolean;
}

export function SectionListingPage({
  sectionSlug,
  baseRoute,
  variant = 'grid',
  withCategories = false,
}: SectionListingPageProps) {
  const fetcher = useCallback(() => getSectionListingViewData(sectionSlug), [sectionSlug]);
  const { data, isLoading } = useApiData<SectionListingViewData>(fetcher, EMPTY);

  return (
    <>
      {data.heroImage ? (
        <HeroBanner
          image={data.heroImage}
          title={data.title || 'Packages'}
          subtitle={data.subtitle || undefined}
        />
      ) : (
        <div className="bg-primary-900 py-16 sm:py-24">
          <h1 className="text-center text-3xl font-heading font-bold text-white sm:text-5xl">
            {data.title || (isLoading ? 'Loading…' : 'Packages')}
          </h1>
          {data.subtitle ? (
            <p className="mt-3 text-center text-white/80 max-w-2xl mx-auto px-4">{data.subtitle}</p>
          ) : null}
        </div>
      )}

      {isLoading ? (
        <section className="bg-gray-50 min-h-screen py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CarouselSkeleton count={6} />
          </div>
        </section>
      ) : data.packages.length > 0 ? (
        <PackageList
          packages={data.packages}
          categories={withCategories ? data.categories : undefined}
          baseRoute={baseRoute}
          variant={variant}
        />
      ) : (
        <section className="bg-gray-50 min-h-[40vh] py-10">
          <EmptyState message="No packages yet" subMessage="Add packages from the admin panel to show them here." />
        </section>
      )}
    </>
  );
}
