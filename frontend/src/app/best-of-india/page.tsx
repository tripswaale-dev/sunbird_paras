import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { bestOfIndiaPackages } from '@/data/bestOfIndiaData';

export const metadata = {
  title: 'Best of India | Sunbird Vacations',
  description: 'Experience the diverse and incredible beauty of India with our curated travel packages.',
};

export default function BestOfIndiaPage() {
  return (
    <>
      <HeroBanner
        image="/images/india/rajasthan.jpg"
        title="Best of India"
        subtitle="Experience the diverse and incredible beauty of India."
      />
      <PackageList packages={bestOfIndiaPackages} baseRoute="/best-of-india" />
    </>
  );
}
