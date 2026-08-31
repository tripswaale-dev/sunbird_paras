'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md',
  secondary:
    'bg-secondary text-white hover:bg-secondary-dark shadow-sm hover:shadow-md',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost:
    'text-primary hover:bg-primary-50',
  accent:
    'bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md',
  white:
    'bg-white text-primary hover:bg-primary-50 shadow-sm hover:shadow-md',
  pill:
    'bg-white text-primary shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
  'pill-teal':
    'bg-primary text-white shadow-md hover:-translate-y-1 hover:shadow-xl',
} as const;

const sizes = {
  sm: 'px-4 py-2 min-h-[44px] text-sm',
  md: 'px-6 py-2.5 min-h-[44px] text-base',
  lg: 'px-8 py-3.5 min-h-[44px] text-lg',
  pill: 'h-[44px] px-[24px] text-[16px]',
  'pill-sm': 'h-[44px] md:h-9 px-5 text-sm',
  'pill-md': 'h-[44px] md:h-11 px-6 text-base',
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, as, className, children, ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium',
      'rounded-full transition-all duration-300 ease-smooth',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.97]',
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={baseStyles}>
          {children}
        </Link>
      );
    }

    if (as) {
      const Component = as;
      return (
        <Component className={baseStyles} {...(props as Record<string, unknown>)}>
          {children}
        </Component>
      );
    }

    return (
      <button ref={ref} className={baseStyles} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
