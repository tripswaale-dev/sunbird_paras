import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { DayBadge } from "@/components/ui/day-badge";
import { ItineraryDay } from "@/types/package";
import { MapPin, Info } from "lucide-react";

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

export const ItineraryAccordion = ({ itinerary }: ItineraryAccordionProps) => {
  const items = itinerary.map((item) => ({
    id: `day-${item.day}`,
    title: (
      <div className="flex items-center gap-4">
        <DayBadge day={item.day} />
        <span className="font-heading font-semibold text-lg md:text-xl text-text">
          {item.title}
        </span>
      </div>
    ),
    content: (
      <div className="space-y-4 text-text-muted leading-relaxed">
        <p>{item.description}</p>
        
        {item.stayInformation && (
          <div className="flex items-start gap-2 bg-primary-50 p-3 rounded-lg text-primary-900 mt-4">
            <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="font-medium">{item.stayInformation}</span>
          </div>
        )}
        
        {item.notes && (
          <div className="flex items-start gap-2 text-sm text-text-light italic mt-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{item.notes}</span>
          </div>
        )}
      </div>
    ),
  }));

  return <Accordion items={items} allowMultiple={true} />;
};
