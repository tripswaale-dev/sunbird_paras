'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bed, Utensils, Binoculars } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { resolvePublicImageSrc } from '@/lib/media';

interface HorizontalPackageCardProps {
  title: string;
  image: string;
  price: string;
  duration?: string;
  href?: string;
  className?: string;
}

export function HorizontalPackageCard({
  title,
  image,
  price,
  duration,
  href,
  className,
}: HorizontalPackageCardProps) {
  const generatedHref = href || `/packages/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const imageSrc = resolvePublicImageSrc(image) || image;

  return (
    <Link href={generatedHref} className={cn('block w-full cursor-pointer', className)}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.4, ease: 'easeOut' } }}
        className="bg-surface-muted rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row w-full max-w-4xl mx-auto border border-gray-100"
      >
        {/* Image */}
        <div className="relative w-full md:w-[40%] h-[200px] md:h-[260px] shrink-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col grow justify-between">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">{title}</h3>
            {duration && (
              <p className="text-primary text-sm mb-6">{duration}</p>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Bed size={18} />
                <span>Accommodation</span>
              </div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Utensils size={18} />
                <span>Meals</span>
              </div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Binoculars size={18} />
                <span>Sightseeing</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-primary text-sm mb-0.5">starts</p>
              <div className="flex items-baseline gap-2">
                <span className="text-primary text-2xl md:text-3xl font-bold">{price}</span>
                <span className="text-primary text-sm">(06 PAX)</span>
              </div>
            </div>
            <Button
              as="span"
              className="bg-secondary hover:bg-secondary-dark text-white rounded-full px-6 py-2.5 font-semibold shrink-0"
            >
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
