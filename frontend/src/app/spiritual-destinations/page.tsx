import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getSectionListingMetadata,
  getSpiritualDestinationsListingPackages,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('spiritual-destinations');
}

export default async function SpiritualDestinationsPage() {
  const packages = await getSpiritualDestinationsListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/spiritual/kedarnath.jpg"
        title="Spiritual Destinations"
        subtitle="Embark on a soulful journey to sacred destinations."
      />
      <PackageList packages={packages} baseRoute="/spiritual-destinations" />
    </>
  );
}
