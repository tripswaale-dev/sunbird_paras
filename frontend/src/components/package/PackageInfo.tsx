import React from "react";
import { Clock } from "lucide-react";

interface PackageInfoProps {
  title: string;
  duration: { nights: number; days: number };
  destinations: string[];
}

export const PackageInfo = ({ title, duration, destinations }: PackageInfoProps) => {
  return (
    <div className="py-6 border-b border-border">
      <h1 className="text-3xl md:text-5xl font-heading text-primary-900 mb-4 tracking-tight uppercase">
        {title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm md:text-base font-medium">
        <div className="flex items-center gap-1.5 bg-primary-50 text-primary-800 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span>
            {duration.nights}N / {duration.days}D
          </span>
        </div>
        
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-border" />
        
        <div className="flex flex-wrap items-center gap-2">
          {destinations.map((dest, index) => (
            <React.Fragment key={index}>
              <span className="text-text">{dest}</span>
              {index < destinations.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-primary-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
