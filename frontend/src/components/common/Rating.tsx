import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  color?: string;
  className?: string;
}

export function Rating({ value, count, color = 'text-secondary', className }: RatingProps) {
  return (
    <div className={cn('flex items-center text-xs', color, className)}>
      <Star className="h-3 w-3 mr-0.5 fill-current" />
      <span className="font-bold">{typeof value === 'number' ? value.toFixed(1) : value}</span>
      {count !== undefined && (
        <span className="text-gray-500 ml-0.5">({count})</span>
      )}
    </div>
  );
}
