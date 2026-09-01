'use client';

import { useState, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterTabs } from '@/components/common/FilterTabs';
import { PackageCard } from '@/components/common/PackageCard';
import { HorizontalPackageCard } from '@/components/common/HorizontalPackageCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Container } from '@/components/ui/container';
import { TravelPackage } from '@/data/travelPackages';
import { motion, AnimatePresence } from 'framer-motion';

interface PackageListProps {
  packages: TravelPackage[];
  categories?: string[];
  baseRoute?: string;
  variant?: 'grid' | 'horizontal';
  header?: ReactNode;
}

export function PackageList({ packages, categories, baseRoute = '/packages', variant = 'grid', header }: PackageListProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <PackageListInner packages={packages} categories={categories} baseRoute={baseRoute} variant={variant} header={header} />
    </Suspense>
  );
}

function PackageListInner({ packages, categories, baseRoute, variant, header }: PackageListProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || categories?.[0] || '';
  
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  
  const currentSearchCategory = searchParams.get('category');
  const [prevSearchCategory, setPrevSearchCategory] = useState(currentSearchCategory);

  if (currentSearchCategory !== prevSearchCategory) {
    setPrevSearchCategory(currentSearchCategory);
    if (currentSearchCategory && categories?.includes(currentSearchCategory)) {
      setActiveCategory(currentSearchCategory);
    }
  }

  const filteredPackages = categories && categories.length > 0 && activeCategory
    ? packages.filter((pkg) => {
        const catMatch = pkg.category === activeCategory;
        const titleMatch = pkg.title.toLowerCase().includes(activeCategory.toLowerCase());
        return catMatch || titleMatch;
      })
    : packages;

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <Container>
        {header}

        {/* Category Filters */}
        {categories && categories.length > 0 && (
          <FilterTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        )}

        {/* Package List */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory || 'all'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={variant === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" : "flex flex-col gap-8 max-w-4xl mx-auto"}
            >
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  variant === 'grid' ? (
                    <PackageCard 
                      key={pkg.id} 
                      title={pkg.title}
                      image={pkg.image}
                      price={`₹${pkg.price.toLocaleString('en-IN')}`}
                      priceSuffix="/person"
                      duration={pkg.duration}
                      category={pkg.category}
                      location={pkg.category} // Or some other appropriate field if available
                      href={`${baseRoute}/${pkg.id}`}
                      accentColor="var(--color-primary)" // Primary brand green
                    />
                  ) : (
                    <HorizontalPackageCard 
                      key={pkg.id} 
                      title={pkg.title}
                      image={pkg.image}
                      price={`₹${pkg.price.toLocaleString('en-IN')}`}
                      duration={pkg.duration}
                      href={`${baseRoute}/${pkg.id}`}
                    />
                  )
                ))
              ) : (
                <EmptyState />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
