import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import {
  getGatewayToHillsListingData,
  getSectionListingMetadata,
} from '@/lib/api/sections';

export async function generateMetadata() {
  return getSectionListingMetadata('gateway-to-the-hills');
}

export default async function GatewayToHillsPage() {
  const { packages, categories } = await getGatewayToHillsListingData();

  return (
    <>
      <HeroBanner
        image="/hills/lifestyle.png"
        title="Gateway to the Hills"
        subtitle="Escape to the serene and majestic mountains with our curated packages."
      />
      <PackageList packages={packages} categories={categories} baseRoute="/gateway-to-the-hills" variant="horizontal" />
    </>
  );
}
