'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  as?: 'section' | 'div';
  bg?: string;
  className?: string;
  innerClassName?: string;
  animate?: boolean;
  children: React.ReactNode;
}

export function Section({
  as: Tag = 'section',
  bg = 'bg-surface',
  className,
  innerClassName,
  animate = true,
  children,
}: SectionProps) {
  const inner = (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding', innerClassName)}>
      {children}
    </div>
  );

  if (!animate) {
    return (
      <Tag className={cn(bg, className)}>
        {inner}
      </Tag>
    );
  }

  return (
    <Tag className={cn(bg, className)}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {inner}
      </motion.div>
    </Tag>
  );
}
