import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SearchChipProps {
  icon: LucideIcon;
  label: string;
  className?: string;
  onClick?: () => void;
}

export function SearchChip({ icon: Icon, label, className, onClick }: SearchChipProps) {
  const content = (
    <>
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </>
  );

  const classes = cn(
    'flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-full shadow-sm hover:bg-primary-50 transition-colors',
    className
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/search?q=${encodeURIComponent(label)}`} className={classes}>
      {content}
    </Link>
  );
}
