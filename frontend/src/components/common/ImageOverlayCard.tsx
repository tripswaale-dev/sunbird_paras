'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toUsableImageSrc } from '@/lib/media';

interface ImageOverlayCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string | null;
  /** 'hover' shows text on hover, 'always' shows text permanently */
  overlayMode?: 'hover' | 'always';
  featured?: boolean;
  href?: string;
  className?: string;
}

function OverlayMedia({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-primary via-primary-dark to-primary-900"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

export function ImageOverlayCard({
  title,
  subtitle,
  description,
  image,
  overlayMode = 'always',
  featured,
  href,
  className,
}: ImageOverlayCardProps) {
  const isHover = overlayMode === 'hover';
  const generatedHref = href || `/packages/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const imageSrc = toUsableImageSrc(image);

  const CardContent = (
    <motion.div
      whileHover={{ y: -4, scale: isHover ? 1 : 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'relative overflow-hidden rounded-[20px] group cursor-pointer shadow-lg',
        'transition-all duration-500',
        featured && 'col-span-2',
        className
      )}
    >
      <OverlayMedia src={imageSrc} alt={title} />

      {/* Overlay gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent',
          isHover && 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'
        )}
      />

      {/* Text */}
      <div
        className={cn(
          'absolute bottom-5 left-5',
          isHover && 'opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0'
        )}
      >
        <h3 className="text-white text-xl md:text-2xl font-semibold drop-shadow-lg font-heading">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/95 text-base md:text-lg mt-1 drop-shadow-sm">{subtitle}</p>
        )}
        {description && (
          <p className="text-white/80 text-sm md:text-base mt-0.5 drop-shadow-sm">{description}</p>
        )}
      </div>
    </motion.div>
  );

  return href !== null ? (
    <Link href={generatedHref} className={cn('block w-full h-full', featured && 'col-span-2')}>
      {CardContent}
    </Link>
  ) : CardContent;
}
