import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { popularPackages } from '@/data/popularDestinationsData';

export const metadata = {
  title: 'Popular Destinations | Sunbird Vacations',
  description: 'Explore the most popular travel destinations and curated packages for an unforgettable experience.',
};

export default function PopularDestinationsPage() {
  return (
    <>
      <HeroBanner
        image="/images/destinations/ladakh.jpg"
        title="Popular Destinations"
        subtitle="Explore the most loved destinations and curated packages."
      />
      <PackageList packages={popularPackages} baseRoute="/popular-destinations" />
    </>
  );
}
