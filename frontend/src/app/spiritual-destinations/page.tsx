import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('spiritual-destinations');
}

export default function SpiritualDestinationsPage() {
  return (
    <SectionListingPage
      sectionSlug="spiritual-destinations"
      baseRoute="/spiritual-destinations"
    />
  );
}
