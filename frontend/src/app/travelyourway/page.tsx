import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { travelPackages, travelCategories } from '@/data/travelPackages';

export const metadata = {
  title: 'Travel Your Way | Sunbird Vacations',
  description: 'Discover curated travel experiences tailored to your travel style. Browse pocket-friendly, adventure, wildlife, spiritual, and luxury holiday packages.',
};

export default function PackagesPage() {
  return (
    <>
      <HeroBanner
        image="/images/hero/travel-your-way.png"
        title="Choose your journey"
        subtitle="Discover curated experiences tailored to your travel style."
      />
      <PackageList packages={travelPackages} categories={travelCategories} baseRoute="/travelyourway" variant="horizontal" />
    </>
  );
}
