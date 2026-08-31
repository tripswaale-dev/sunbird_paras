import React from "react";
import { Metadata } from "next";
import { allTravelPackages } from "@/data/packages";
import { navbarDestinations } from "@/data/navigation";
import { PackageList } from "@/components/sections/packages/PackageList";
import { HeroBanner } from "@/components/common/HeroBanner";

export const metadata: Metadata = {
  title: "Tour Packages | Sunbird Vacations",
  description: "Explore our premium tour packages to beautiful destinations including Kashmir, Kerala, Ladakh, and more.",
};

export default function PackagesPage() {
  return (
    <>
      <HeroBanner
        image="/images/hero/travel-your-way.png"
        title="Explore By Destination"
        subtitle="Discover our handpicked selection of premium tour packages across various magnificent destinations."
      />
      
      <PackageList
        packages={allTravelPackages}
        categories={navbarDestinations}
        baseRoute="/packages"
      />
    </>
  );
}
