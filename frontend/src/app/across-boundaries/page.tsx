import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { acrossBoundariesPackages } from '@/data/acrossBoundariesData';

export const metadata = {
  title: 'Across Boundaries | Sunbird Vacations',
  description: 'Discover international travel packages and experiences beyond borders.',
};

export default function AcrossBoundariesPage() {
  return (
    <>
      <HeroBanner
        image="/images/international/maldives.jpg"
        title="Across Boundaries"
        subtitle="Discover incredible international destinations and experiences."
      />
      <PackageList packages={acrossBoundariesPackages} baseRoute="/across-boundaries" />
    </>
  );
}
