import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Package } from "@/types/package";

interface PackageCardProps {
  pkg: Package;
}

export const PackageCard = ({ pkg }: PackageCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm group hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden shrink-0">
        <Image 
          src={pkg.gallery[0] || pkg.heroImages[0]} 
          alt={pkg.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary">
          {pkg.duration.nights}N / {pkg.duration.days}D
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-heading font-semibold text-primary-900 mb-2">
          {pkg.title}
        </h3>
        <p className="text-text-muted text-sm mb-4 line-clamp-2">
          {pkg.overview}
        </p>
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-text-light uppercase tracking-wider mb-1">Starting from</p>
            <p className="font-semibold text-lg text-primary-900"><IndianRupee className="inline-block w-[0.8em] h-[0.8em] mr-0.5 mb-[0.1em]" strokeWidth={2.5} />{pkg.startingPrice}</p>
          </div>
          <Link href={`/packages/${pkg.slug}`}>
            <Button variant="outline" size="sm" className="rounded-lg">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
