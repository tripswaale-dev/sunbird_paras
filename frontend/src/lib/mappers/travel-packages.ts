import type { TravelPackage } from '@/data/travelPackages';
import type { PackageSummary } from '@/lib/api/types';

export function mapPackageSummariesToTravelPackages(
  packages: PackageSummary[]
): TravelPackage[] {
  return [...packages]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((pkg) => ({
      id: pkg.slug,
      title: pkg.title,
      category: pkg.category,
      duration: pkg.duration.formatted,
      price: pkg.price,
      pax: pkg.pax ?? 2,
      image: pkg.image,
      amenities: pkg.inclusions ?? [],
    }));
}
