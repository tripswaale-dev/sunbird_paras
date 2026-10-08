'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroBanner } from '@/components/common/HeroBanner';
import { isHeroCategory } from '@/lib/admin/package-categories';
import { getHeroCategoryPackages, getSearchPackages } from '@/lib/api/packages';
import type { TravelPackage } from '@/data/travelPackages';
import { SearchResults } from './SearchResults';
import { Loader } from '@/components/ui/loader';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const heroParam = searchParams.get('hero') ?? '';
  const heroCategory = isHeroCategory(heroParam) ? heroParam : null;
  const displayQuery = heroCategory ?? query;
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPackages() {
      setIsLoading(true);

      try {
        const results = heroCategory
          ? await getHeroCategoryPackages(heroCategory)
          : await getSearchPackages(query);

        if (!cancelled) {
          setPackages(results);
        }
      } catch {
        if (!cancelled) {
          setPackages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPackages();

    return () => {
      cancelled = true;
    };
  }, [heroCategory, query]);

  return (
    <>
      <HeroBanner
        image="/images/destinations/kerala.jpg"
        title="Find Your Adventure"
        subtitle="Explore our curated collection of packages"
      />
      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center bg-gray-50">
          <Loader />
        </div>
      ) : (
        <SearchResults query={displayQuery} packages={packages} />
      )}
    </>
  );
}
