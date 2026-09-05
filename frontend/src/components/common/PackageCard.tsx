'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PriceTag } from '@/components/common/PriceTag';
import { Chip } from '@/components/common/Chip';
import { Button } from '@/components/ui/button';
import { resolvePublicImageSrc } from '@/lib/media';

interface PackageCardProps {
  title: string;
  image: string;
  price: string;
  location?: string;
  duration?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  category?: string;
  accentColor?: string;
  priceSuffix?: string;
  href?: string;
  className?: string;
}

export function PackageCard({
  title,
  image,
  price,
  location,
  duration,

  category,
  accentColor = 'var(--color-primary)',
  priceSuffix,
  href,
  className,
}: PackageCardProps) {
  const generatedHref = href || `/packages/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const imageSrc = resolvePublicImageSrc(image) || image;

  return (
    <Link href={generatedHref} className={cn('block h-full cursor-pointer', className)}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.4, ease: "easeOut" } }}
        className={cn(
          'bg-white rounded-[20px] overflow-hidden shadow-lg group',
          'transition-all duration-500 hover:shadow-2xl flex flex-col h-full'
        )}
      >
      {/* Image */}
      <div className="relative h-[260px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col grow">
        {/* Location row */}
        {location && (
          <div className="flex justify-between items-start mb-1">
            <div
              className="flex items-center text-[11px] font-bold uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {location}
            </div>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-1 mt-1">
          {title}
        </h3>

        {/* Duration text (no tag) */}
        {duration && !category && (
          <p className="text-gray-400 text-xs mb-4">{duration}</p>
        )}

        {/* Duration + Category chips */}
        {(duration && category) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Chip>{duration}</Chip>
            <Chip>{category}</Chip>
          </div>
        )}

        {/* Price footer */}
        <div className="mt-auto">
          <div className="w-full h-px bg-gray-200 mb-3" />
          <div className="flex justify-between items-center pt-1">
            <PriceTag
              price={price}
              suffix={priceSuffix}
              accentColor={`text-[${accentColor}]`}
              className={accentColor !== '#0e6973' ? '' : undefined}
            />
            <Button
              as="span"
              variant="pill-teal"
              size="pill-sm"
              className="shrink-0"
              style={{ backgroundColor: accentColor } as React.CSSProperties}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
  );
}
