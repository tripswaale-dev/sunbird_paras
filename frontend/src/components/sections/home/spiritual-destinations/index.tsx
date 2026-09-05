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
import { getSpiritualDestinationsPackages } from '@/lib/api/sections';
import type { SpiritualPackage } from '@/data/spiritual-packages';

export function SpiritualDestinations() {
  const fetcher = useCallback(() => getSpiritualDestinationsPackages(), []);
  const { data: packages, isLoading } = useApiData<SpiritualPackage[]>(fetcher, []);

  return (
    <Section bg="bg-surface-alt">
      {isLoading ? (
        <>
          <SectionHeader
            title="Spiritual Destinations"
            subtitle="Sacred journeys and soulful experiences across India"
            viewAllHref="/spiritual-destinations"
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
                title="Spiritual Destinations"
                subtitle="Sacred journeys and soulful experiences across India"
                viewAllHref="/spiritual-destinations"
              />
            )}
            buttonPosition="sides"
            renderItem={(pkg) => (
              <PackageCard
                title={pkg.title}
                image={pkg.image}
                price={pkg.price}
                location={pkg.location}
                tag={pkg.tag}
                href={pkg.href}
              />
            )}
          />
          <div className="flex md:hidden justify-center mt-8">
            <Button variant="pill-teal" size="pill-md" href="/spiritual-destinations">
              View all
            </Button>
          </div>
        </>
      ) : (
        <>
          <SectionHeader
            title="Spiritual Destinations"
            subtitle="Sacred journeys and soulful experiences across India"
            viewAllHref="/spiritual-destinations"
          />
          <EmptyState compact message="No packages yet" />
        </>
      )}
    </Section>
  );
}
