'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  as?: 'section' | 'div';
  bg?: string;
  className?: string;
  innerClassName?: string;
  animate?: boolean;
  sectionRef?: (node: Element | null) => void;
  children: React.ReactNode;
}

export function Section({
  as: Tag = 'section',
  bg = 'bg-surface',
  className,
  innerClassName,
  animate = true,
  sectionRef,
  children,
}: SectionProps) {
  const shellClassName = cn(bg, className);
  const padded = (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding', innerClassName)}>
      {children}
    </div>
  );

  const inner = animate ? (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {padded}
    </motion.div>
  ) : (
    padded
  );

  // Render concrete tags so ref types resolve (union `as` breaks Ref<HTMLElement> vs Ref<HTMLDivElement>).
  if (Tag === 'div') {
    return (
      <div ref={sectionRef} className={shellClassName}>
        {inner}
      </div>
    );
  }

  return (
    <section ref={sectionRef} className={shellClassName}>
      {inner}
    </section>
  );
}
