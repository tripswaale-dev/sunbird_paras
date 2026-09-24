'use client';

import { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { resolvePublicImageSrc, toUsableImageSrc } from '@/lib/media';
import { cn } from '@/lib/utils';

const PLACEHOLDER_LOGO = '/svlogo.png';

type SafeImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  /** Extra classes for the empty/broken placeholder surface */
  placeholderClassName?: string;
  /** Show a small label on the placeholder (default: off) */
  showPlaceholderLabel?: boolean;
};

export function ImagePlaceholder({
  className,
  label,
  rounded,
}: {
  className?: string;
  label?: string;
  rounded?: boolean;
}) {
  return (
    <div
      aria-hidden={!label}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-white p-4',
        rounded && 'rounded-[20px]',
        className
      )}
    >
      <div className="relative h-[28%] max-h-16 min-h-8 w-[45%] max-w-[180px] min-w-[72px]">
        <Image
          src={PLACEHOLDER_LOGO}
          alt=""
          fill
          sizes="(max-width: 640px) 100px, 180px"
          className="object-contain"
          quality={100}
        />
      </div>
      {label ? (
        <span className="max-w-[90%] px-2 text-center text-[11px] font-medium tracking-wide text-text-muted sm:text-xs">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * next/image wrapper that resolves backend media URLs and shows a branded
 * placeholder when the source is missing or fails to load.
 */
export function SafeImage({
  src,
  alt,
  className,
  placeholderClassName,
  showPlaceholderLabel = false,
  onError,
  fill,
  ...props
}: SafeImageProps) {
  const resolved = toUsableImageSrc(resolvePublicImageSrc(src));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  if (!resolved || failed) {
    return (
      <ImagePlaceholder
        className={cn(fill && 'absolute inset-0', placeholderClassName)}
        label={showPlaceholderLabel ? alt || 'Image unavailable' : undefined}
      />
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={resolved}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
