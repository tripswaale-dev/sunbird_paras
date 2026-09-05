import { getSectionListingMetadata } from '@/lib/api/sections';
import { SectionListingPage } from '@/components/sections/packages/SectionListingPage';

export async function generateMetadata() {
  return getSectionListingMetadata('across-boundaries');
}

export default function AcrossBoundariesPage() {
  return <SectionListingPage sectionSlug="across-boundaries" baseRoute="/across-boundaries" />;
}
