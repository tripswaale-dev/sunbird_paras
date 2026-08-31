import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
  className?: string;
}

export function CarouselButton({ direction, className, ...props }: CarouselButtonProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <button
      className={cn(
        "w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-text",
        "hover:bg-primary hover:text-white transition-all duration-300",
        className
      )}
      {...props}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
