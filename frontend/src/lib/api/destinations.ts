import { apiGet } from '@/lib/api/client';
import type { DestinationsHubResponse } from '@/lib/api/types';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import {
  getStaticDestinationsHub,
  type StaticDestinationsHubData,
} from '@/data/destinations';

export type DestinationsHubData = StaticDestinationsHubData;

export async function getDestinationsHub(category?: string): Promise<DestinationsHubData> {
  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const data = await apiGet<DestinationsHubResponse>(`/destinations${query}`);

    const packages = data.packages.length
      ? mapPackageSummariesToTravelPackages(data.packages)
      : getStaticDestinationsHub(data.activeCategory).packages;

    return {
      categories: data.categories,
      activeCategory: data.activeCategory,
      heroImage: data.heroImage,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      listingPath: data.listingPath,
      packages,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch destinations hub; using static fallback.',
        error
      );
    }

    return getStaticDestinationsHub(category);
  }
}
