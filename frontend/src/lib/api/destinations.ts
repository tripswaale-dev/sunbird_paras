import { apiGet } from '@/lib/api/client';
import type { DestinationsHubResponse } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import type { StaticDestinationsHubData } from '@/data/destinations';

export type DestinationsHubData = StaticDestinationsHubData;

const EMPTY_DESTINATIONS_HUB: DestinationsHubData = {
  categories: [],
  activeCategory: '',
  heroImage: '',
  heroTitle: '',
  heroSubtitle: '',
  listingPath: '/destinations',
  packages: [],
};

export async function getDestinationsHub(category?: string): Promise<DestinationsHubData> {
  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const data = await apiGet<DestinationsHubResponse>(`/destinations${query}`);

    return {
      categories: data.categories,
      activeCategory: data.activeCategory,
      heroImage: resolvePublicImageSrc(data.heroImage),
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      listingPath: data.listingPath,
      packages: mapPackageSummariesToTravelPackages(data.packages),
    };
  } catch {
    return EMPTY_DESTINATIONS_HUB;
  }
}
