import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getExploreWildIndiaListingPackages,
  getSectionListingMetadata,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('explore-wild-india');
}

export default async function ExploreWildIndiaPage() {
  const packages = await getExploreWildIndiaListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/wildlife/tiger.jpg"
        title="Explore the WILD"
        subtitle="Discover the untamed beauty of nature with our wildlife safaris."
      />
      <PackageList packages={packages} baseRoute="/explore-wild-india" />
    </>
  );
}
