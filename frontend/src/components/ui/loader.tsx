import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} role="status" aria-label="Loading">
      <div
        className={cn(
          'animate-spin rounded-full border-primary/20 border-t-primary',
          sizeClasses[size]
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-surface-muted overflow-hidden', className)}>
      <div className="h-48 bg-border-light" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-border-light" />
        <div className="h-3 w-full rounded bg-border-light" />
        <div className="h-3 w-2/3 rounded bg-border-light" />
      </div>
    </div>
  );
}
