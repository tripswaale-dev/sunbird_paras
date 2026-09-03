export const SECTION_API_SLUGS = {
  'popular-destinations': 'popular-destinations',
  travelyourway: 'travel-your-way',
  'across-boundaries': 'across-boundaries',
  'gateway-to-the-hills': 'gateway-to-the-hills',
  'best-of-india': 'best-of-india',
  'spiritual-destinations': 'spiritual-destinations',
  'explore-wild-india': 'explore-wild-india',
} as const;

export type SectionRouteKey = keyof typeof SECTION_API_SLUGS;
