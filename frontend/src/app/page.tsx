import { Hero } from '@/components/sections/home/hero/hero';
import { PopularDestinations } from '@/components/sections/home/popular-destinations';
import { ChooseYourJourney } from '@/components/sections/home/travel-your-way';
import { AcrossBoundaries } from '@/components/sections/home/across-boundaries';
import { GatewayToHills } from '@/components/sections/home/gateway-to-hills';
import { BestOfIndia } from '@/components/sections/home/best-of-india';
import { CustomerPromise } from '@/components/sections/home/customer-promise';
import { SpiritualDestinations } from '@/components/sections/home/spiritual-destinations';
import { ExploreWildIndia } from '@/components/sections/home/explore-wild-india';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <ChooseYourJourney />
      <AcrossBoundaries />
      <GatewayToHills />
      <BestOfIndia />
      <CustomerPromise />
      <SpiritualDestinations />
      <ExploreWildIndia />
    </>
  );
}
