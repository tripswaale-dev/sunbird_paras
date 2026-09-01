import type { PopularDestination, PopularStat } from '@/data/popular-destinations';
import type { PackageSummary, SectionStat } from '@/lib/api/types';

export function mapPackageSummariesToPopularDestinations(
  packages: PackageSummary[]
): PopularDestination[] {
  return [...packages]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((pkg) => ({
      name: pkg.title,
      location: `Starts at ₹${pkg.price.toLocaleString('en-IN')}`,
      duration: pkg.duration.short,
      imageSrc: pkg.image,
      href: `/packages/${pkg.slug}`,
    }));
}

export function mapSectionStatsToPopularStats(
  stats: SectionStat[]
): PopularStat[] {
  return [...stats]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ value, label }) => ({ value, label }));
}
