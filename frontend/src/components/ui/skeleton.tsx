import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[20px] bg-gray-200',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-lg flex flex-col h-full">
      <Skeleton className="h-[260px] rounded-none" />
      <div className="p-5 flex flex-col grow">
        <Skeleton className="h-3 w-24 rounded-md mb-2" />
        <Skeleton className="h-5 w-3/4 rounded-md mb-1" />
        <Skeleton className="h-3 w-1/3 rounded-md mb-4" />
        <div className="mt-auto">
          <div className="w-full h-px bg-gray-200 mb-3" />
          <div className="flex justify-between items-center pt-1">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OverlayCardSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-[160px] rounded-[22px]', className)} />;
}

export function GridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 lg:gap-5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <OverlayCardSkeleton key={i} className="h-[150px] lg:h-[190px]" />
      ))}
    </div>
  );
}

export function BentoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Skeleton className="h-[200px] md:h-[280px] col-span-1 row-span-2" />
      <Skeleton className="h-[130px] md:h-[130px]" />
      <Skeleton className="h-[130px] md:h-[130px]" />
      <Skeleton className="h-[130px] md:h-[130px]" />
      <Skeleton className="h-[130px] md:h-[130px]" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full">
      <Skeleton className="absolute inset-0 rounded-none" />
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="text-center py-4">
          <Skeleton className="h-8 w-16 rounded-md mx-auto mb-2" />
          <Skeleton className="h-4 w-24 rounded-md mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function PromiseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <Skeleton className="h-12 w-12 rounded-full mb-4" />
      <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
      <Skeleton className="h-3 w-full rounded-md mb-1" />
      <Skeleton className="h-3 w-2/3 rounded-md" />
    </div>
  );
}

export function PromiseGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PromiseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-[400px] w-full rounded-[28px] mb-8" />
      <Skeleton className="h-8 w-1/2 rounded-md mb-4" />
      <Skeleton className="h-4 w-3/4 rounded-md mb-2" />
      <Skeleton className="h-4 w-2/3 rounded-md mb-2" />
      <Skeleton className="h-4 w-1/2 rounded-md mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] rounded-[20px]" />
        <Skeleton className="h-[200px] rounded-[20px]" />
        <Skeleton className="h-[200px] rounded-[20px]" />
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-[20px] overflow-hidden shadow-lg">
          <Skeleton className="h-[200px] rounded-none" />
          <div className="p-5">
            <Skeleton className="h-3 w-20 rounded-md mb-3" />
            <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
            <Skeleton className="h-3 w-full rounded-md mb-1" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GallerySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn('rounded-[16px]', i % 3 === 0 ? 'h-[280px]' : 'h-[200px]')} />
      ))}
    </div>
  );
}
