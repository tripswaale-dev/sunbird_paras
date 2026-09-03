'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroBanner } from '@/components/common/HeroBanner';
import { DestinationCategoryTabs } from '@/components/destinations/DestinationCategoryTabs';
import { PackageList } from '@/components/sections/packages/PackageList';
import { getDestinationsHub, type DestinationsHubData } from '@/lib/api/destinations';
import { Loader } from '@/components/ui/loader';

export function DestinationsPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const [hub, setHub] = useState<DestinationsHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHub() {
      setIsLoading(true);

      try {
        const data = await getDestinationsHub(category);

        if (!cancelled) {
          setHub(data);
        }
      } catch {
        if (!cancelled) {
          setHub(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHub();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (isLoading || !hub) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <HeroBanner
        image={hub.heroImage}
        title={hub.heroTitle}
        subtitle={hub.heroSubtitle ?? undefined}
      />
      <PackageList
        packages={hub.packages}
        baseRoute={hub.listingPath}
        header={
          <DestinationCategoryTabs
            categories={hub.categories}
            activeCategory={hub.activeCategory}
          />
        }
      />
    </>
  );
}
