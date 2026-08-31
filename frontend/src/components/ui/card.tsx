import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface overflow-hidden',
        'border border-border-light',
        'shadow-card',
        hover && 'transition-all duration-300 ease-smooth hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardImage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  );
}

function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
}

function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-5 pb-5 pt-0', className)}>
      {children}
    </div>
  );
}

Card.Image = CardImage;
Card.Content = CardContent;
Card.Footer = CardFooter;
