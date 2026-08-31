import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroBanner } from '@/components/common/HeroBanner';
import { SearchResults } from './SearchResults';

export const metadata: Metadata = {
  title: 'Search Results | Sunbird Vacations',
  description: 'Search for your next dream vacation package across India and beyond.',
};

export default function SearchPage() {
  return (
    <>
      <HeroBanner
        image="/images/destinations/kerala.jpg"
        title="Find Your Adventure"
        subtitle="Explore our curated collection of packages"
      />
      <Suspense fallback={<div className="py-20 text-center bg-gray-50 text-gray-500">Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
}
