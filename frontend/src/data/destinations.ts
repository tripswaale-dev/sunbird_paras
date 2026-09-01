import type { DestinationCategorySummary } from '@/lib/api/types';
import type { TravelPackage } from './travelPackages';
import { acrossBoundariesPackages } from './acrossBoundariesData';
import { exploreWildPackages } from './exploreWildData';
import { hillPackages } from './hillPackages';
import { popularPackages } from './popularDestinationsData';
import { spiritualDestinationsPackages } from './spiritualDestinationsData';

export const destinationCategories: DestinationCategorySummary[] = [
  {
    code: 'popular',
    title: 'Popular Destinations',
    heroImage: '/images/destinations/ladakh.jpg',
    heroTitle: 'Popular Destinations',
    heroSubtitle: 'Handpicked experiences for every kind of traveller',
    listingPath: '/popular-destinations',
  },
  {
    code: 'hills',
    title: 'Hill Stations',
    heroImage: '/hills/lifestyle.png',
    heroTitle: 'Gateway to the Hills',
    heroSubtitle: 'Escape to the serene and majestic mountains',
    listingPath: '/gateway-to-the-hills',
  },
  {
    code: 'beaches',
    title: 'Beaches',
    heroImage: '/images/india/goa.jpg',
    heroTitle: 'Beaches',
    heroSubtitle: "Sun, sand, and sea — India's finest coastal getaways",
    listingPath: '/packages',
  },
  {
    code: 'spiritual',
    title: 'Spiritual',
    heroImage: '/images/spiritual/kedarnath.jpg',
    heroTitle: 'Spiritual Destinations',
    heroSubtitle: 'Sacred journeys and soulful experiences across India',
    listingPath: '/spiritual-destinations',
  },
  {
    code: 'wildlife',
    title: 'Wildlife',
    heroImage: '/images/wildlife/tiger.jpg',
    heroTitle: 'Explore the WILD',
    heroSubtitle: 'Handpicked wildlife experiences for every kind of traveller',
    listingPath: '/explore-wild-india',
  },
  {
    code: 'international',
    title: 'International',
    heroImage: '/images/international/maldives.jpg',
    heroTitle: 'Across Boundaries',
    heroSubtitle: 'International packages curated for best experiences',
    listingPath: '/across-boundaries',
  },
];

const staticPackagesByCode: Record<string, TravelPackage[]> = {
  popular: popularPackages,
  hills: hillPackages,
  beaches: popularPackages.filter((pkg) => pkg.category === 'Beaches'),
  spiritual: spiritualDestinationsPackages,
  wildlife: exploreWildPackages,
  international: acrossBoundariesPackages,
};

export interface StaticDestinationsHubData {
  categories: DestinationCategorySummary[];
  activeCategory: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string | null;
  listingPath: string;
  packages: TravelPackage[];
}

export function getStaticDestinationsHub(category?: string): StaticDestinationsHubData {
  const activeCategory =
    category && destinationCategories.some((item) => item.code === category)
      ? category
      : destinationCategories[0].code;

  const active =
    destinationCategories.find((item) => item.code === activeCategory) ??
    destinationCategories[0];

  return {
    categories: destinationCategories,
    activeCategory: active.code,
    heroImage: active.heroImage,
    heroTitle: active.heroTitle,
    heroSubtitle: active.heroSubtitle,
    listingPath: active.listingPath,
    packages: staticPackagesByCode[active.code] ?? [],
  };
}
