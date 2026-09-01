import type { JourneyCategory } from '@/data/journey-categories';
import type { SectionCategory } from '@/lib/api/types';

export function mapSectionCategoriesToJourneyCategories(
  categories: SectionCategory[]
): JourneyCategory[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      title: category.title,
      category: category.filter_value ?? category.title,
      image: category.image ?? '',
    }));
}
