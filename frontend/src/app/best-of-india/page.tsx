import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getBestOfIndiaListingPackages,
  getSectionListingMetadata,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('best-of-india');
}

export default async function BestOfIndiaPage() {
  const packages = await getBestOfIndiaListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/india/rajasthan.jpg"
        title="Best of India"
        subtitle="Experience the diverse and incredible beauty of India."
      />
      <PackageList packages={packages} baseRoute="/best-of-india" />
    </>
  );
}
