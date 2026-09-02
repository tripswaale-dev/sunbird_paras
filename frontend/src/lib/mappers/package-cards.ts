import type { InternationalPackage } from '@/data/international-packages';
import type { PackageSummary } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

export function mapPackageSummariesToPackageCards(
  packages: PackageSummary[],
  hrefPrefix: string
): InternationalPackage[] {
  return [...packages]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((pkg) => ({
      title: pkg.title,
      image: resolvePublicImageSrc(pkg.image),
      price: `₹${pkg.price.toLocaleString('en-IN')}`,
      location: pkg.location,
      duration: pkg.duration.formatted,
      href: `${hrefPrefix}/${pkg.slug}`,
    }));
}
