import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('gateway-to-the-hills');
}

export default function GatewayToHillsPage() {
  return (
    <SectionListingPage
      sectionSlug="gateway-to-the-hills"
      baseRoute="/gateway-to-the-hills"
      variant="horizontal"
      withCategories
    />
  );
}
