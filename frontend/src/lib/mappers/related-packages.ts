import type { PackageSummary } from '@/lib/api/types';
import type { Package } from '@/types/package';

export function mapPackageSummaryToRelatedPackage(summary: PackageSummary): Package {
  return {
    id: summary.slug,
    slug: summary.slug,
    title: summary.title,
    startingPrice: summary.price,
    duration: {
      nights: summary.duration.nights,
      days: summary.duration.days,
    },
    heroImages: [summary.image],
    gallery: [summary.image],
    overview: summary.subtitle ?? `Experience ${summary.title}`,
    destinations: [],
    itinerary: [],
    sightseeing: [],
    inclusions: [],
    exclusions: [],
    highlights: [],
    faqs: [],
  };
}
