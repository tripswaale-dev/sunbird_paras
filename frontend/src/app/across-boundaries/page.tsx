import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getAcrossBoundariesListingPackages,
  getSectionListingMetadata,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('across-boundaries');
}

export default async function AcrossBoundariesPage() {
  const packages = await getAcrossBoundariesListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/international/maldives.jpg"
        title="Across Boundaries"
        subtitle="Discover incredible international destinations and experiences."
      />
      <PackageList packages={packages} baseRoute="/across-boundaries" />
    </>
  );
}
