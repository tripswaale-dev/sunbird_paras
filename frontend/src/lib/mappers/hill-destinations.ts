import type { HillDestination } from '@/data/hill-destinations';
import type { SectionCategory } from '@/lib/api/types';

export function mapSectionCategoriesToHillDestinations(
  categories: SectionCategory[]
): HillDestination[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      title: category.title,
      category: category.filter_value ?? category.title,
      image: category.image ?? '',
      ...(category.is_featured ? { featured: true } : {}),
    }));
}
