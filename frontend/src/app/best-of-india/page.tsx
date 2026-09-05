import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('best-of-india');
}

export default function BestOfIndiaPage() {
  return <SectionListingPage sectionSlug="best-of-india" baseRoute="/best-of-india" />;
}
