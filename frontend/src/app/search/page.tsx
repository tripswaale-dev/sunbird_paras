import React from 'react';
import { HeroBanner } from '@/components/common/HeroBanner';
import { getSearchPackages } from '@/lib/api/packages';
import { getSearchMetadata } from '@/lib/api/page-seo';
import { SearchResults } from './SearchResults';

export async function generateMetadata() {
  return getSearchMetadata();
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? '';
  const packages = await getSearchPackages(query);

  return (
    <>
      <HeroBanner
        image="/images/destinations/kerala.jpg"
        title="Find Your Adventure"
        subtitle="Explore our curated collection of packages"
      />
      <SearchResults query={query} packages={packages} />
    </>
  );
}
