'use client';

import { useCallback } from 'react';
import { Section } from '@/components/common/Section';
import { Carousel } from '@/components/common/Carousel';
import { PackageCard } from '@/components/common/PackageCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { CarouselSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import { getExploreWildIndiaPackages } from '@/lib/api/sections';
import type { WildlifePackage } from '@/data/wildlife-packages';

export function ExploreWildIndia() {
  const fetcher = useCallback(() => getExploreWildIndiaPackages(), []);
  const { data: packages, isLoading } = useApiData<WildlifePackage[]>(fetcher, []);

  const header = (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 relative gap-6">
      <div>
        <h2 className="font-heading text-4xl lg:text-6xl font-semibold leading-tight text-text">
          Explore the <span className="text-primary">WILD</span>
        </h2>
        <p className="text-gray-500 text-base lg:text-lg mt-3 max-w-xl">
          Handpicked wildlife experiences for every kind of traveller
        </p>
      </div>
      <div className="flex w-full md:w-auto shrink-0 mt-4 md:mt-0">
        <Button
          variant="pill-teal"
          size="pill-md"
          href="/explore-wild-india"
          className="w-full md:w-auto"
        >
          View all
        </Button>
      </div>
    </div>
  );

  return (
    <Section>
      {isLoading ? (
        <>
          {header}
          <CarouselSkeleton count={3} />
        </>
      ) : packages.length > 0 ? (
        <Carousel
          items={packages}
          visibleCount={3}
          getKey={(pkg, i) => `${pkg.title}-${i}`}
          renderHeader={() => header}
          buttonPosition="sides"
          renderItem={(pkg) => (
            <PackageCard
              title={pkg.title}
              image={pkg.image}
              price={pkg.price}
              location={pkg.location}
              duration={pkg.duration}
              category={pkg.category}
              rating={pkg.rating}
              reviews={pkg.reviews}
              accentColor="var(--color-primary)"
              priceSuffix="/person"
              href={pkg.href}
            />
          )}
        />
      ) : (
        <>
          {header}
          <EmptyState compact message="No packages yet" />
        </>
      )}
    </Section>
  );
}
