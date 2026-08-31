import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { hillPackages, hillCategories } from '@/data/hillPackages';

export const metadata = {
  title: 'Gateway to the Hills | Sunbird Vacations',
  description: 'Escape to the serene and majestic mountains. Discover curated hill station packages tailored to your travel style.',
};

export default function GatewayToHillsPage() {
  return (
    <>
      <HeroBanner
        image="/hills/lifestyle.png"
        title="Gateway to the Hills"
        subtitle="Escape to the serene and majestic mountains with our curated packages."
      />
      <PackageList packages={hillPackages} categories={hillCategories} baseRoute="/gateway-to-the-hills" variant="horizontal" />
    </>
  );
}
