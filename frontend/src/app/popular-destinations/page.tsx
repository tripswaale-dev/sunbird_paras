import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getPopularDestinationsListingPackages,
  getSectionListingMetadata,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('popular-destinations');
}

export default async function PopularDestinationsPage() {
  const packages = await getPopularDestinationsListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/destinations/ladakh.jpg"
        title="Popular Destinations"
        subtitle="Explore the most loved destinations and curated packages."
      />
      <PackageList packages={packages} baseRoute="/popular-destinations" />
    </>
  );
}
