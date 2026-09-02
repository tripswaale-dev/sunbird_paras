import type { BestOfIndiaDestination } from '@/data/best-of-india';
import type { PackageSummary } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

export function mapPackageSummariesToBestOfIndiaDestinations(
  packages: PackageSummary[]
): BestOfIndiaDestination[] {
  return [...packages]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((pkg) => ({
      title: pkg.title,
      subtitle: `Starts at ₹${pkg.price.toLocaleString('en-IN')}`,
      duration: pkg.duration.short,
      image: resolvePublicImageSrc(pkg.image),
      href: `/packages/${pkg.slug}`,
    }));
}
