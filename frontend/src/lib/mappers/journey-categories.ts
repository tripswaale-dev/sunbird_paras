import type { JourneyCategory } from '@/data/journey-categories';
import type { SectionCategory } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

export function mapSectionCategoriesToJourneyCategories(
  categories: SectionCategory[]
): JourneyCategory[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      title: category.title,
      category: category.filter_value ?? category.title,
      image: resolvePublicImageSrc(category.image),
    }));
}
