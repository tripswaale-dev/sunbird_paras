import { apiGet } from '@/lib/api/client';
import type { SectionDetail } from '@/lib/api/types';
import { mapSectionCategoriesToJourneyCategories } from '@/lib/mappers/journey-categories';
import {
  journeyCategories,
  type JourneyCategory,
} from '@/data/journey-categories';

export async function fetchSection(slug: string): Promise<SectionDetail> {
  return apiGet<SectionDetail>(`/sections/${slug}`);
}

export async function getTravelYourWayCategories(): Promise<JourneyCategory[]> {
  try {
    const section = await fetchSection('travel-your-way');

    if (!section.categories.length) {
      return journeyCategories;
    }

    return mapSectionCategoriesToJourneyCategories(section.categories);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch travel-your-way categories; using static fallback.',
        error
      );
    }

    return journeyCategories;
  }
}
