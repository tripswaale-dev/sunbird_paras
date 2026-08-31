import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  titleColor = 'text-secondary',
  subtitleColor = 'text-primary',
  viewAllHref,
  viewAllLabel = 'View all',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6', className)}>
      <div>
        <h2 className={cn('font-heading text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight', titleColor)}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn('text-base lg:text-lg mt-2 max-w-lg', subtitleColor)}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex w-full md:w-auto items-center gap-4 shrink-0 mt-4 md:mt-0">
        {children}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className={cn(
              'h-[44px] px-6 bg-primary text-white rounded-full font-medium shadow-md text-base',
              'inline-flex w-full md:w-auto items-center justify-center shrink-0',
              'hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
            )}
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
