'use client';

import { useSearchParams } from 'next/navigation';
import { allTravelPackages } from '@/data/packages';
import { PackageList } from '@/components/sections/packages/PackageList';
import { Container } from '@/components/ui/container';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const filteredPackages = allTravelPackages.filter(pkg => {
    const searchString = `${pkg.title} ${pkg.category} ${pkg.duration}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });

  return (
    <>
      <section className="bg-gray-50 pt-16 pb-6">
        <Container>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">
             Search Results
           </h2>
           <p className="text-gray-600 text-lg">
             {filteredPackages.length} {filteredPackages.length === 1 ? 'result' : 'results'} found for &quot;{query}&quot;
           </p>
        </Container>
      </section>
      
      {filteredPackages.length > 0 ? (
        <PackageList packages={filteredPackages} baseRoute="/packages" />
      ) : (
        <section className="bg-gray-50 pb-32">
          <Container>
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No packages found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn&apos;t find any packages matching &quot;{query}&quot;. Try searching for a different destination, category, or keyword.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
