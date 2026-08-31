import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { spiritualDestinationsPackages } from '@/data/spiritualDestinationsData';

export const metadata = {
  title: 'Spiritual Destinations | Sunbird Vacations',
  description: 'Embark on a spiritual journey to sacred destinations and find inner peace.',
};

export default function SpiritualDestinationsPage() {
  return (
    <>
      <HeroBanner
        image="/images/spiritual/kedarnath.jpg"
        title="Spiritual Destinations"
        subtitle="Embark on a soulful journey to sacred destinations."
      />
      <PackageList packages={spiritualDestinationsPackages} baseRoute="/spiritual-destinations" />
    </>
  );
}
