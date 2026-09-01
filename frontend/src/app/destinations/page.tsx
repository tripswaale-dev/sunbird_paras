import { HeroBanner } from '@/components/common/HeroBanner';
import { DestinationCategoryTabs } from '@/components/destinations/DestinationCategoryTabs';
import { PackageList } from '@/components/sections/packages/PackageList';
import { getDestinationsHub } from '@/lib/api/destinations';
import { getDestinationsMetadata } from '@/lib/api/page-seo';

export async function generateMetadata() {
  return getDestinationsMetadata();
}

interface DestinationsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const { category } = await searchParams;
  const hub = await getDestinationsHub(category);

  return (
    <>
      <HeroBanner
        image={hub.heroImage}
        title={hub.heroTitle}
        subtitle={hub.heroSubtitle ?? undefined}
      />
      <PackageList
        packages={hub.packages}
        baseRoute={hub.listingPath}
        header={
          <DestinationCategoryTabs
            categories={hub.categories}
            activeCategory={hub.activeCategory}
          />
        }
      />
    </>
  );
}
