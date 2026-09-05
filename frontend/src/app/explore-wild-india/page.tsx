import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('explore-wild-india');
}

export default function ExploreWildIndiaPage() {
  return (
    <SectionListingPage sectionSlug="explore-wild-india" baseRoute="/explore-wild-india" />
  );
}
