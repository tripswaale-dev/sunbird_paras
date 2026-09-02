'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GalleryImagePreviewProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-28 w-28',
};

export function GalleryImagePreview({
  src,
  alt,
  size = 'sm',
  className,
}: GalleryImagePreviewProps) {
  const [hasError, setHasError] = useState(false);

  if (!src.trim()) {
    return null;
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs text-gray-500',
          sizeClasses[size],
          className
        )}
      >
        No preview
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn(
        'rounded-lg border border-gray-200 object-cover',
        sizeClasses[size],
        className
      )}
    />
  );
}
