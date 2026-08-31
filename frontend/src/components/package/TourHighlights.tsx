import React from "react";
import { Check } from "lucide-react";

interface TourHighlightsProps {
  highlights: string[];
}

export const TourHighlights = ({ highlights }: TourHighlightsProps) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="mt-16 py-12 border-t border-border relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2" />
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-heading text-primary-900 inline-block relative">
          Tour Highlights
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full" />
        </h2>
      </div>

      <div className="bg-surface-alt border border-border rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                <Check className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-text font-medium">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
