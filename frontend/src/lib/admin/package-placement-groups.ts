export const TRAVEL_YOUR_WAY_SECTION_SLUG = 'travel-your-way';

export const HOMEPAGE_CAROUSEL_SECTION_SLUGS = [
  'popular-destinations',
  'best-of-india',
  'across-boundaries',
  'spiritual-destinations',
  'explore-wild-india',
] as const;

export const HILL_SECTION_SLUGS = ['gateway-to-the-hills'] as const;

export const HOMEPAGE_SPOTLIGHT_SECTION_SLUGS = [
  'popular-destinations',
  TRAVEL_YOUR_WAY_SECTION_SLUG,
  'best-of-india',
] as const;

export const PACKAGE_PLACEMENT_GROUP_LABELS = {
  carousels: 'Homepage carousels',
  travelYourWay: 'Travel Your Way',
  hills: 'Hills & other',
} as const;

export interface SectionListingTabConfig {
  label: string;
  listingPath: string;
  placeholder: string;
}

export const SECTION_LISTING_TAB_CONFIG: Record<string, SectionListingTabConfig> = {
  'travel-your-way': {
    label: 'Travel Your Way listing tab',
    listingPath: '/travelyourway',
    placeholder: 'Select tab (e.g. Pocket Friendly)',
  },
  'gateway-to-the-hills': {
    label: 'Gateway to the Hills listing tab',
    listingPath: '/gateway-to-the-hills',
    placeholder: 'Select tab (e.g. Northern Himalayas)',
  },
};

export function hasSectionListingTabPicker(sectionSlug: string): boolean {
  return sectionSlug in SECTION_LISTING_TAB_CONFIG;
}
