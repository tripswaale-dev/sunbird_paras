import type { Package } from '@/types/package';
import type { PackageDetailResponse } from '@/lib/api/types';

function mapImagePaths(
  images: PackageDetailResponse['images'] | undefined,
  fallbackImage: string
): { heroImages: string[]; gallery: string[] } {
  const heroPaths = (images?.hero ?? []).map((image) => image.path);
  const galleryPaths = (images?.gallery ?? []).map((image) => image.path);
  const fallback = fallbackImage ? [fallbackImage] : [];

  const gallery =
    galleryPaths.length > 0
      ? galleryPaths
      : heroPaths.length > 0
        ? heroPaths
        : fallback;

  const heroImages = heroPaths.length > 0 ? heroPaths : fallback;

  return { heroImages, gallery };
}

export function mapPackageDetailToPackage(data: PackageDetailResponse): Package {
  const detail = data.detail;
  const { heroImages, gallery } = mapImagePaths(data.images, data.image);

  return {
    id: data.slug,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? undefined,
    startingPrice: data.price,
    duration: {
      nights: data.duration.nights,
      days: data.duration.days,
    },
    destinations: detail?.destinations ?? [],
    heroImages,
    gallery,
    overview: detail?.overview ?? '',
    itinerary: [...(data.itinerary ?? [])]
      .sort((a, b) => (a.sort_order ?? a.day) - (b.sort_order ?? b.day))
      .map((day) => ({
        day: day.day,
        title: day.title,
        description: day.description,
        stayInformation: day.stay_information ?? undefined,
        notes: day.notes ?? undefined,
        images: day.images?.length ? day.images : undefined,
      })),
    sightseeing: detail?.sightseeing ?? [],
    inclusions: detail?.inclusions ?? [],
    exclusions: detail?.exclusions ?? [],
    highlights: detail?.highlights ?? [],
    faqs: (data.faqs ?? []).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  };
}
