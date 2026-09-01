import React from "react";
import { navbarDestinations } from "@/data/navigation";
import { getPackagesIndexListingPackages } from "@/lib/api/packages";
import { getPackagesMetadata } from "@/lib/api/page-seo";
import { PackageList } from "@/components/sections/packages/PackageList";
import { HeroBanner } from "@/components/common/HeroBanner";

export async function generateMetadata() {
  return getPackagesMetadata();
}

export default async function PackagesPage() {
  const packages = await getPackagesIndexListingPackages();

  return (
    <>
      <HeroBanner
        image="/images/hero/travel-your-way.png"
        title="Explore By Destination"
        subtitle="Discover our handpicked selection of premium tour packages across various magnificent destinations."
      />
      
      <PackageList
        packages={packages}
        categories={navbarDestinations}
        baseRoute="/packages"
      />
    </>
  );
}
