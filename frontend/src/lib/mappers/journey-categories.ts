import { journeyCategories, type JourneyCategory } from '@/data/journey-categories';
import type { SectionCategory } from '@/lib/api/types';
import { resolvePublicImageSrc, toUsableImageSrc } from '@/lib/media';

function fallbackJourneyImage(title: string, filterValue: string | null): string {
  const needle = (filterValue ?? title).toLowerCase();

  return (
    journeyCategories.find(
      (item) =>
        item.title.toLowerCase() === title.toLowerCase() ||
        item.category.toLowerCase() === needle
    )?.image ?? ''
  );
}

export function mapSectionCategoriesToJourneyCategories(
  categories: SectionCategory[]
): JourneyCategory[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      title: category.title,
      category: category.filter_value ?? category.title,
      image:
        toUsableImageSrc(resolvePublicImageSrc(category.image)) ??
        fallbackJourneyImage(category.title, category.filter_value),
    }));
}
