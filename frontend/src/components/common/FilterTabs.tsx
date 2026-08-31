import { cn } from '@/lib/utils';

interface FilterTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function FilterTabs({ categories, activeCategory, onSelect }: FilterTabsProps) {
  return (
    <div className="flex justify-center flex-wrap gap-4 py-8">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'px-6 py-2.5 rounded-full font-semibold text-base md:text-lg transition-all duration-300',
              'hover:scale-105',
              isActive
                ? 'bg-secondary text-white shadow-md'
                : 'bg-transparent text-primary hover:bg-secondary/10'
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
