import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('travel-your-way');
}

export default function TravelYourWayPage() {
  return (
    <SectionListingPage
      sectionSlug="travel-your-way"
      baseRoute="/travelyourway"
      variant="horizontal"
      withCategories
    />
  );
}
