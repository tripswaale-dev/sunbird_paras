import React from 'react';
import { Metadata } from 'next';
import { HeroBanner } from '@/components/common/HeroBanner';
import { getSearchPackages } from '@/lib/api/packages';
import { SearchResults } from './SearchResults';

export const metadata: Metadata = {
  title: 'Search Results | Sunbird Vacations',
  description: 'Search for your next dream vacation package across India and beyond.',
};

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
