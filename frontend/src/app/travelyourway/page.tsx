import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getSectionListingMetadata,
  getTravelYourWayListingData,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('travel-your-way');
}

export default async function PackagesPage() {
  const { packages, categories } = await getTravelYourWayListingData();

  return (
    <>
      <HeroBanner
        image="/images/hero/travel-your-way.png"
        title="Choose your journey"
        subtitle="Discover curated experiences tailored to your travel style."
      />
      <PackageList packages={packages} categories={categories} baseRoute="/travelyourway" variant="horizontal" />
    </>
  );
}
