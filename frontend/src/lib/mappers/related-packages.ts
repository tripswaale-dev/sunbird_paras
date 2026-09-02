import type { PackageSummary } from '@/lib/api/types';
import type { Package } from '@/types/package';
import { resolvePublicImageSrc } from '@/lib/media';

export function mapPackageSummaryToRelatedPackage(summary: PackageSummary): Package {
  const image = resolvePublicImageSrc(summary.image);

  return {
    id: summary.slug,
    slug: summary.slug,
    title: summary.title,
    startingPrice: summary.price,
    duration: {
      nights: summary.duration.nights,
      days: summary.duration.days,
    },
    heroImages: [image],
    gallery: [image],
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
