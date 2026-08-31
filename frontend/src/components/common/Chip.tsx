import { cn } from '@/lib/utils';

interface ChipProps {
  className?: string;
  children: React.ReactNode;
}

export function Chip({ className, children }: ChipProps) {
  return (
    <span
      className={cn(
        'bg-surface-alt rounded-full px-3 py-1 text-xs text-gray-600 font-medium',
        className
      )}
    >
      {children}
    </span>
  );
}
