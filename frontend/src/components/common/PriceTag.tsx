import { cn } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

interface PriceTagProps {
  price: string;
  label?: string;
  suffix?: string;
  accentColor?: string;
  className?: string;
}

export function PriceTag({
  price,
  label = 'Starting From',
  suffix,
  accentColor = 'text-primary',
  className,
}: PriceTagProps) {
  return (
    <div className={cn(className)}>
      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
        {label}
      </p>
      <div className="flex items-baseline">
        <p className={cn('text-2xl font-semibold', accentColor)}>
          {price.includes('₹') ? (
            <>
              <IndianRupee className="inline-block w-[0.8em] h-[0.8em] mr-[0.05em] mb-[0.1em]" strokeWidth={2.5} />
              {price.replace('₹', '')}
            </>
          ) : (
            price
          )}
        </p>
        {suffix && (
          <span className="text-xs text-gray-400 ml-1 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
}
