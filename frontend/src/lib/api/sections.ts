import type { Metadata } from 'next';
import { apiGet } from '@/lib/api/client';
import type { SectionCategory, SectionDetail, SectionPackagesResponse } from '@/lib/api/types';
import {
  mapSectionDetailToMetadata,
  mapStaticListingToMetadata,
  type StaticListingMetadataFallback,
} from '@/lib/mappers/section-metadata';
import { mapSectionCategoriesToHillDestinations } from '@/lib/mappers/hill-destinations';
import { mapSectionCategoriesToJourneyCategories } from '@/lib/mappers/journey-categories';
import { mapPackageSummariesToBestOfIndiaDestinations } from '@/lib/mappers/best-of-india';
import {
  mapPackageSummariesToPopularDestinations,
  mapSectionStatsToPopularStats,
} from '@/lib/mappers/popular-destinations';
import { mapPackageSummariesToPackageCards } from '@/lib/mappers/package-cards';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import {
  acrossBoundariesPackages,
} from '@/data/acrossBoundariesData';
import { popularPackages } from '@/data/popularDestinationsData';
import { bestOfIndiaPackages } from '@/data/bestOfIndiaData';
import { spiritualDestinationsPackages } from '@/data/spiritualDestinationsData';
import { exploreWildPackages } from '@/data/exploreWildData';
import {
  bestOfIndiaDestinations,
  type BestOfIndiaDestination,
} from '@/data/best-of-india';
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
import {
  spiritualPackages,
  type SpiritualPackage,
} from '@/data/spiritual-packages';
import {
  wildlifePackages,
  type WildlifePackage,
} from '@/data/wildlife-packages';
import {
  popularDestinations,
  popularStats,
  type PopularDestination,
  type PopularStat,
} from '@/data/popular-destinations';
import type { TravelPackage } from '@/data/travelPackages';
import {
  travelCategories,
  travelPackages,
} from '@/data/travelPackages';
import { hillCategories, hillPackages } from '@/data/hillPackages';

export interface PopularDestinationsSectionData {
  destinations: PopularDestination[];
  stats: PopularStat[];
}

export interface CategoryFilteredListingData {
  packages: TravelPackage[];
  categories: string[];
}

function mapSectionCategoriesToFilterTabs(categories: SectionCategory[]): string[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => category.filter_value ?? category.title);
}

export async function getTravelYourWayListingData(): Promise<CategoryFilteredListingData> {
  try {
    const data = await fetchSectionPackages('travel-your-way');

    const categories = data.categories.length
      ? mapSectionCategoriesToFilterTabs(data.categories)
      : travelCategories;

    const packages = data.packages.length
      ? mapPackageSummariesToTravelPackages(data.packages)
      : travelPackages;

    return { packages, categories };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch travel-your-way listing packages; using static fallback.',
        error
      );
    }

    return {
      packages: travelPackages,
      categories: travelCategories,
    };
  }
}

export async function getGatewayToHillsListingData(): Promise<CategoryFilteredListingData> {
  try {
    const data = await fetchSectionPackages('gateway-to-the-hills');

    const categories = data.categories.length
      ? mapSectionCategoriesToFilterTabs(data.categories)
      : hillCategories;

    const packages = data.packages.length
      ? mapPackageSummariesToTravelPackages(data.packages)
      : hillPackages;

    return { packages, categories };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch gateway-to-the-hills listing packages; using static fallback.',
        error
      );
    }

    return {
      packages: hillPackages,
      categories: hillCategories,
    };
  }
}

export async function fetchSection(slug: string): Promise<SectionDetail> {
  return apiGet<SectionDetail>(`/sections/${slug}`);
}

const LISTING_METADATA_FALLBACKS: Record<string, StaticListingMetadataFallback> = {
  'across-boundaries': {
    title: 'Across Boundaries | Sunbird Vacations',
    description:
      'Discover international travel packages and experiences beyond borders.',
  },
  'popular-destinations': {
    title: 'Popular Destinations | Sunbird Vacations',
    description:
      'Explore the most popular travel destinations and curated packages for an unforgettable experience.',
  },
  'best-of-india': {
    title: 'Best of India | Sunbird Vacations',
    description:
      'Experience the diverse and incredible beauty of India with our curated travel packages.',
  },
  'spiritual-destinations': {
    title: 'Spiritual Destinations | Sunbird Vacations',
    description:
      'Embark on a spiritual journey to sacred destinations and find inner peace.',
  },
  'explore-wild-india': {
    title: 'Explore the WILD | Sunbird Vacations',
    description:
      'Discover the untamed beauty of nature with our wildlife safari packages.',
  },
  'travel-your-way': {
    title: 'Travel Your Way | Sunbird Vacations',
    description:
      'Discover curated travel experiences tailored to your travel style. Browse pocket-friendly, adventure, wildlife, spiritual, and luxury holiday packages.',
  },
  'gateway-to-the-hills': {
    title: 'Gateway to the Hills | Sunbird Vacations',
    description:
      'Escape to the serene and majestic mountains. Discover curated hill station packages tailored to your travel style.',
  },
};

export async function getSectionListingMetadata(sectionSlug: string): Promise<Metadata> {
  const fallback = LISTING_METADATA_FALLBACKS[sectionSlug] ?? {
    title: 'Sunbird Vacations',
    description: 'Discover curated travel packages with Sunbird Vacations.',
  };

  try {
    const section = await fetchSection(sectionSlug);

    return mapSectionDetailToMetadata(section, fallback);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch section metadata for "${sectionSlug}"; using static fallback.`,
        error
      );
    }

    return mapStaticListingToMetadata(fallback);
  }
}

export async function fetchSectionPackages(
  slug: string,
  category?: string
): Promise<SectionPackagesResponse> {
  const query = category
    ? `?category=${encodeURIComponent(category)}`
    : '';

  return apiGet<SectionPackagesResponse>(`/sections/${slug}/packages${query}`);
}

export async function getAcrossBoundariesListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('across-boundaries');

    if (!data.packages.length) {
      return acrossBoundariesPackages;
    }

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch across-boundaries listing packages; using static fallback.',
        error
      );
    }

    return acrossBoundariesPackages;
  }
}

export async function getPopularDestinationsListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('popular-destinations');

    if (!data.packages.length) {
      return popularPackages;
    }

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch popular-destinations listing packages; using static fallback.',
        error
      );
    }

    return popularPackages;
  }
}

export async function getBestOfIndiaListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('best-of-india');

    if (!data.packages.length) {
      return bestOfIndiaPackages;
    }

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch best-of-india listing packages; using static fallback.',
        error
      );
    }

    return bestOfIndiaPackages;
  }
}

export async function getSpiritualDestinationsListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('spiritual-destinations');

    if (!data.packages.length) {
      return spiritualDestinationsPackages;
    }

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch spiritual-destinations listing packages; using static fallback.',
        error
      );
    }

    return spiritualDestinationsPackages;
  }
}

export async function getExploreWildIndiaListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('explore-wild-india');

    if (!data.packages.length) {
      return exploreWildPackages;
    }

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch explore-wild-india listing packages; using static fallback.',
        error
      );
    }

    return exploreWildPackages;
  }
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

export async function getSpiritualDestinationsPackages(): Promise<SpiritualPackage[]> {
  try {
    const section = await fetchSection('spiritual-destinations');

    if (!section.packages.length) {
      return spiritualPackages;
    }

    const sorted = [...section.packages].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    const cards = mapPackageSummariesToPackageCards(sorted, '/packages');

    return cards.map((card, index) => ({
      title: card.title,
      image: card.image,
      price: card.price,
      location: card.location,
      tag: sorted[index].tag ?? '',
      href: card.href,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch spiritual-destinations packages; using static fallback.',
        error
      );
    }

    return spiritualPackages;
  }
}

export async function getExploreWildIndiaPackages(): Promise<WildlifePackage[]> {
  try {
    const section = await fetchSection('explore-wild-india');

    if (!section.packages.length) {
      return wildlifePackages;
    }

    const sorted = [...section.packages].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    const cards = mapPackageSummariesToPackageCards(sorted, '/packages');

    return cards.map((card, index) => ({
      title: card.title,
      image: card.image,
      price: card.price,
      location: card.location,
      duration: card.duration!,
      category: sorted[index].category,
      href: card.href,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch explore-wild-india packages; using static fallback.',
        error
      );
    }

    return wildlifePackages;
  }
}

export async function getBestOfIndiaDestinations(): Promise<BestOfIndiaDestination[]> {
  try {
    const section = await fetchSection('best-of-india');

    if (!section.packages.length) {
      return bestOfIndiaDestinations;
    }

    return mapPackageSummariesToBestOfIndiaDestinations(section.packages);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch best-of-india destinations; using static fallback.',
        error
      );
    }

    return bestOfIndiaDestinations;
  }
}

export async function getPopularDestinationsSection(): Promise<PopularDestinationsSectionData> {
  try {
    const section = await fetchSection('popular-destinations');

    return {
      destinations: section.packages.length
        ? mapPackageSummariesToPopularDestinations(section.packages)
        : popularDestinations,
      stats: section.stats.length
        ? mapSectionStatsToPopularStats(section.stats)
        : popularStats,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch popular-destinations section; using static fallback.',
        error
      );
    }

    return {
      destinations: popularDestinations,
      stats: popularStats,
    };
  }
}
