import React from "react";
import Image from "next/image";
import { BulletList } from "@/components/ui/bullet-list";

interface SightseeingTabProps {
  sightseeing: string[];
  images?: string[]; // E.g., taking the first two images from gallery
}

export const SightseeingTab = ({ sightseeing, images }: SightseeingTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div>
        <h3 className="font-heading text-2xl mb-6 text-primary-900">Places You Will Visit</h3>
        <BulletList items={sightseeing} type="bullet" className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2" />
      </div>
      
      {images && images.length >= 2 && (
        <div className="relative h-[400px] hidden md:block">
          <div className="absolute top-0 right-10 w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-elevated z-10 transition-transform duration-500 hover:scale-105 hover:z-30">
            <Image src={images[0]} alt="Sightseeing 1" fill className="object-cover" />
          </div>
          <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-elevated z-20 transition-transform duration-500 hover:scale-105 hover:z-30">
            <Image src={images[1]} alt="Sightseeing 2" fill className="object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};
