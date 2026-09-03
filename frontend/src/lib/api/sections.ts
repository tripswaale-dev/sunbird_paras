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
import type { BestOfIndiaDestination } from '@/data/best-of-india';
import type { InternationalPackage } from '@/data/international-packages';
import type { HillDestination } from '@/data/hill-destinations';
import type { JourneyCategory } from '@/data/journey-categories';
import type { SpiritualPackage } from '@/data/spiritual-packages';
import type { WildlifePackage } from '@/data/wildlife-packages';
import type { PopularDestination, PopularStat } from '@/data/popular-destinations';
import type { TravelPackage } from '@/data/travelPackages';

export interface PopularDestinationsSectionData {
  destinations: PopularDestination[];
  stats: PopularStat[];
}

export interface CategoryFilteredListingData {
  packages: TravelPackage[];
  categories: string[];
}

const TRAVEL_YOUR_WAY_HOME_LIMIT = 4;

function selectHomepageCategories(
  categories: SectionCategory[],
  limit: number
): SectionCategory[] {
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  const featured = sorted.filter((category) => category.is_featured);

  return (featured.length > 0 ? featured : sorted).slice(0, limit);
}

function mapSectionCategoriesToFilterTabs(categories: SectionCategory[]): string[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => category.filter_value ?? category.title);
}

export async function getTravelYourWayListingData(): Promise<CategoryFilteredListingData> {
  try {
    const data = await fetchSectionPackages('travel-your-way');

    return {
      packages: mapPackageSummariesToTravelPackages(data.packages),
      categories: mapSectionCategoriesToFilterTabs(data.categories),
    };
  } catch {
    return { packages: [], categories: [] };
  }
}

export async function getGatewayToHillsListingData(): Promise<CategoryFilteredListingData> {
  try {
    const data = await fetchSectionPackages('gateway-to-the-hills');

    return {
      packages: mapPackageSummariesToTravelPackages(data.packages),
      categories: mapSectionCategoriesToFilterTabs(data.categories),
    };
  } catch {
    return { packages: [], categories: [] };
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
  } catch {
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

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch {
    return [];
  }
}

export async function getPopularDestinationsListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('popular-destinations');

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch {
    return [];
  }
}

export async function getBestOfIndiaListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('best-of-india');

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch {
    return [];
  }
}

export async function getSpiritualDestinationsListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('spiritual-destinations');

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch {
    return [];
  }
}

export async function getExploreWildIndiaListingPackages(): Promise<TravelPackage[]> {
  try {
    const data = await fetchSectionPackages('explore-wild-india');

    return mapPackageSummariesToTravelPackages(data.packages);
  } catch {
    return [];
  }
}

export async function getTravelYourWayCategories(): Promise<JourneyCategory[]> {
  try {
    const section = await fetchSection('travel-your-way');

    return mapSectionCategoriesToJourneyCategories(
      selectHomepageCategories(section.categories, TRAVEL_YOUR_WAY_HOME_LIMIT)
    );
  } catch {
    return [];
  }
}

export async function getGatewayToHillsCategories(): Promise<HillDestination[]> {
  try {
    const section = await fetchSection('gateway-to-the-hills');

    return mapSectionCategoriesToHillDestinations(section.categories);
  } catch {
    return [];
  }
}

export async function getAcrossBoundariesPackages(): Promise<InternationalPackage[]> {
  try {
    const section = await fetchSection('across-boundaries');

    return mapPackageSummariesToPackageCards(section.packages, '/across-boundaries');
  } catch {
    return [];
  }
}

export async function getSpiritualDestinationsPackages(): Promise<SpiritualPackage[]> {
  try {
    const section = await fetchSection('spiritual-destinations');
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
  } catch {
    return [];
  }
}

export async function getExploreWildIndiaPackages(): Promise<WildlifePackage[]> {
  try {
    const section = await fetchSection('explore-wild-india');
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
  } catch {
    return [];
  }
}

export async function getBestOfIndiaDestinations(): Promise<BestOfIndiaDestination[]> {
  try {
    const section = await fetchSection('best-of-india');

    return mapPackageSummariesToBestOfIndiaDestinations(section.packages);
  } catch {
    return [];
  }
}

export async function getPopularDestinationsSection(): Promise<PopularDestinationsSectionData> {
  try {
    const section = await fetchSection('popular-destinations');

    return {
      destinations: mapPackageSummariesToPopularDestinations(section.packages),
      stats: mapSectionStatsToPopularStats(section.stats),
    };
  } catch {
    return {
      destinations: [],
      stats: [],
    };
  }
}
