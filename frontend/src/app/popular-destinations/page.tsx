import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('popular-destinations');
}

export default function PopularDestinationsPage() {
  return (
    <SectionListingPage sectionSlug="popular-destinations" baseRoute="/popular-destinations" />
  );
}
