import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { exploreWildPackages } from '@/data/exploreWildData';

export const metadata = {
  title: 'Explore the WILD | Sunbird Vacations',
  description: 'Discover the untamed beauty of nature with our wildlife safari packages.',
};

export default function ExploreWildIndiaPage() {
  return (
    <>
      <HeroBanner
        image="/images/wildlife/tiger.jpg"
        title="Explore the WILD"
        subtitle="Discover the untamed beauty of nature with our wildlife safaris."
      />
      <PackageList packages={exploreWildPackages} baseRoute="/explore-wild-india" />
    </>
  );
}
