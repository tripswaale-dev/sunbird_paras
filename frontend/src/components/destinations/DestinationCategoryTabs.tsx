'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DestinationCategorySummary } from '@/lib/api/types';

interface DestinationCategoryTabsProps {
  categories: DestinationCategorySummary[];
  activeCategory: string;
}

export function DestinationCategoryTabs({
  categories,
  activeCategory,
}: DestinationCategoryTabsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center flex-wrap gap-4 py-8">
      {categories.map((category) => {
        const isActive = activeCategory === category.code;

        return (
          <button
            key={category.code}
            type="button"
            onClick={() => router.push(`/destinations?category=${category.code}`)}
            className={cn(
              'px-6 py-2.5 rounded-full font-semibold text-base md:text-lg transition-all duration-300',
              'hover:scale-105',
              isActive
                ? 'bg-secondary text-white shadow-md'
                : 'bg-transparent text-primary hover:bg-secondary/10'
            )}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}
