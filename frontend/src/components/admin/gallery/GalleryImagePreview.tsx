'use client';

import { useEffect, useState } from 'react';
import { resolvePublicImageSrc } from '@/lib/media';
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

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const previewSrc = resolvePublicImageSrc(src);

  if (!previewSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500',
          sizeClasses[size],
          className
        )}
      >
        No image
      </div>
    );
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
      src={previewSrc}
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
