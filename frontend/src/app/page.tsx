import { Hero } from '@/components/sections/home/hero/hero';
import { PopularDestinations } from '@/components/sections/home/popular-destinations';
import { ChooseYourJourney } from '@/components/sections/home/travel-your-way';
import { AcrossBoundaries } from '@/components/sections/home/across-boundaries';
import { GatewayToHills } from '@/components/sections/home/gateway-to-hills';
import { BestOfIndia } from '@/components/sections/home/best-of-india';
import { CustomerPromise } from '@/components/sections/home/customer-promise';
import { SpiritualDestinations } from '@/components/sections/home/spiritual-destinations';
import { ExploreWildIndia } from '@/components/sections/home/explore-wild-india';
import {
  getAcrossBoundariesPackages,
  getBestOfIndiaDestinations,
  getExploreWildIndiaPackages,
  getGatewayToHillsCategories,
  getPopularDestinationsSection,
  getSpiritualDestinationsPackages,
  getTravelYourWayCategories,
} from '@/lib/api/sections';
import { getHomepage } from '@/lib/api/homepage';

export default async function Home() {
  const [
    homepage,
    popularDestinationsSection,
    travelYourWayCategories,
    acrossBoundariesPackages,
    gatewayToHillsCategories,
    spiritualDestinationsPackages,
    exploreWildIndiaPackages,
    bestOfIndiaDestinations,
  ] = await Promise.all([
    getHomepage(),
    getPopularDestinationsSection(),
    getTravelYourWayCategories(),
    getAcrossBoundariesPackages(),
    getGatewayToHillsCategories(),
    getSpiritualDestinationsPackages(),
    getExploreWildIndiaPackages(),
    getBestOfIndiaDestinations(),
  ]);

  return (
    <>
      <Hero {...homepage.hero} />
      <PopularDestinations
        destinations={popularDestinationsSection.destinations}
        stats={popularDestinationsSection.stats}
      />
      <ChooseYourJourney categories={travelYourWayCategories} />
      <AcrossBoundaries packages={acrossBoundariesPackages} />
      <GatewayToHills categories={gatewayToHillsCategories} />
      <BestOfIndia destinations={bestOfIndiaDestinations} />
      <CustomerPromise promises={homepage.customerPromises} />
      <SpiritualDestinations packages={spiritualDestinationsPackages} />
      <ExploreWildIndia packages={exploreWildIndiaPackages} />
    </>
  );
}
