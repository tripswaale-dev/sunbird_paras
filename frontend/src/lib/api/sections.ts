import { apiGet } from '@/lib/api/client';
import type { SectionDetail } from '@/lib/api/types';
import { mapSectionCategoriesToHillDestinations } from '@/lib/mappers/hill-destinations';
import { mapSectionCategoriesToJourneyCategories } from '@/lib/mappers/journey-categories';
import { mapPackageSummariesToPackageCards } from '@/lib/mappers/package-cards';
import {
  internationalPackages,
  type InternationalPackage,
} from '@/data/international-packages';
import {
  hillDestinations,
  type HillDestination,
} from '@/data/hill-destinations';
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

export async function getGatewayToHillsCategories(): Promise<HillDestination[]> {
  try {
    const section = await fetchSection('gateway-to-the-hills');

    if (!section.categories.length) {
      return hillDestinations;
    }

    return mapSectionCategoriesToHillDestinations(section.categories);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch gateway-to-the-hills categories; using static fallback.',
        error
      );
    }

    return hillDestinations;
  }
}

export async function getAcrossBoundariesPackages(): Promise<InternationalPackage[]> {
  try {
    const section = await fetchSection('across-boundaries');

    if (!section.packages.length) {
      return internationalPackages;
    }

    return mapPackageSummariesToPackageCards(
      section.packages,
      '/across-boundaries'
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch across-boundaries packages; using static fallback.',
        error
      );
    }

    return internationalPackages;
  }
}
