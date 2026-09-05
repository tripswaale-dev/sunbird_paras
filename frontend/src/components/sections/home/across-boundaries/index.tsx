'use client';

import { useCallback } from 'react';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { Carousel } from '@/components/common/Carousel';
import { PackageCard } from '@/components/common/PackageCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { CarouselSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import { getAcrossBoundariesPackages } from '@/lib/api/sections';
import type { InternationalPackage } from '@/data/international-packages';

export function AcrossBoundaries() {
  const fetcher = useCallback(() => getAcrossBoundariesPackages(), []);
  const { data: packages, isLoading } = useApiData<InternationalPackage[]>(fetcher, []);

  return (
    <Section>
      {isLoading ? (
        <>
          <SectionHeader
            title="Across Boundaries"
            subtitle="International packages curated for best experiences"
            viewAllHref="/across-boundaries"
          />
          <CarouselSkeleton count={3} />
        </>
      ) : packages.length > 0 ? (
        <>
          <Carousel
            items={packages}
            visibleCount={3}
            getKey={(pkg, i) => `${pkg.title}-${i}`}
            renderHeader={() => (
              <SectionHeader
                title="Across Boundaries"
                subtitle="International packages curated for best experiences"
                viewAllHref="/across-boundaries"
              />
            )}
            buttonPosition="sides"
            renderItem={(pkg) => <PackageCard {...pkg} />}
          />
          <div className="flex md:hidden justify-center mt-8">
            <Button variant="pill-teal" size="pill-md" href="/across-boundaries">
              View all
            </Button>
          </div>
        </>
      ) : (
        <>
          <SectionHeader
            title="Across Boundaries"
            subtitle="International packages curated for best experiences"
            viewAllHref="/across-boundaries"
          />
          <EmptyState compact message="No packages yet" />
        </>
      )}
    </Section>
  );
}
