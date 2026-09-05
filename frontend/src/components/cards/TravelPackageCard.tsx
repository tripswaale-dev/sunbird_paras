import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AmenityItem } from '@/components/common/AmenityItem';
import { IndianRupee } from 'lucide-react';
import Link from 'next/link';
import type { TravelPackage } from '@/data/travelPackages';
import { resolvePublicImageSrc } from '@/lib/media';

interface TravelPackageCardProps {
  packageData: TravelPackage;
  baseRoute?: string;
}

export function TravelPackageCard({ packageData, baseRoute = '/packages' }: TravelPackageCardProps) {
  const { title, duration, price, pax, image, amenities } = packageData;
  const imageSrc = resolvePublicImageSrc(image) || image;

  return (
    <Link href={`${baseRoute}/${packageData.id}`} className="block h-full cursor-pointer">
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-white rounded-[24px] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col md:flex-row h-full"
      >
      {/* Left Image Section */}
      <div className="relative w-full md:w-[320px] h-[240px] shrink-0 overflow-hidden md:rounded-l-[24px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>

      {/* Package Information Section */}
      <div className="p-6 md:p-8 flex flex-col justify-between grow">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-primary mb-1">
                {title}
              </h3>
              <p className="text-gray-500 font-medium mb-4">{duration}</p>
            </div>
          </div>

          {/* Amenities Row */}
          <div className="flex flex-wrap gap-4 mb-6 md:mb-0">
            {amenities.map((amenity, idx) => (
              <AmenityItem key={idx} amenity={amenity} />
            ))}
          </div>
        </div>

        {/* Footer (Price & CTA) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 pt-4 border-t border-gray-100 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Starts from</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-bold text-primary">
                <IndianRupee className="inline-block w-[0.8em] h-[0.8em] mr-0.5 mb-[0.1em]" strokeWidth={2.5} />{price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-500 font-medium">({pax.toString().padStart(2, '0')} Pax)</span>
            </div>
          </div>
          
          <Button 
            as="span"
            variant="primary" 
            size="pill-md"
            className="w-full md:w-auto bg-secondary hover:bg-secondary-dark"
          >
            View Details
          </Button>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
