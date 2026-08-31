import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { Package } from "@/types/package";
import { ItineraryAccordion } from "./ItineraryAccordion";
import { SightseeingTab } from "./SightseeingTab";
import { InclusionsTab } from "./InclusionsTab";
import { ExclusionsTab } from "./ExclusionsTab";

interface PackageTabsProps {
  pkg: Package;
}

export const PackageTabs = ({ pkg }: PackageTabsProps) => {
  const tabs = [
    {
      id: "itinerary",
      label: "Itinerary",
      content: <ItineraryAccordion itinerary={pkg.itinerary} />,
    },
    {
      id: "sightseeing",
      label: "Sightseeing",
      content: <SightseeingTab sightseeing={pkg.sightseeing} images={pkg.gallery} />,
    },
    {
      id: "inclusions",
      label: "Inclusions",
      content: <InclusionsTab inclusions={pkg.inclusions} />,
    },
    {
      id: "exclusions",
      label: "Exclusions",
      content: <ExclusionsTab exclusions={pkg.exclusions} />,
    },
  ];

  return (
    <div className="mt-8">
      {/* Overview section before tabs */}
      <div className="mb-10 text-text-muted leading-relaxed text-lg">
        <p>{pkg.overview}</p>
      </div>
      
      <div className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md pt-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <Tabs
          tabs={tabs}
          defaultTabId="itinerary"
          tabListClassName="border-b-2"
          activeTabClassName="font-semibold"
        />
      </div>
    </div>
  );
};
