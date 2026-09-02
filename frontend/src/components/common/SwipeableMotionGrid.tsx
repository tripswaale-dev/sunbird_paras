'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useClientMounted } from '@/lib/hooks/use-client-mounted';

interface SwipeableMotionGridProps {
  className?: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: ReactNode;
}

export function SwipeableMotionGrid({
  className,
  onSwipeLeft,
  onSwipeRight,
  children,
}: SwipeableMotionGridProps) {
  const mounted = useClientMounted();

  return (
    <motion.div
      className={className}
      drag={mounted ? 'x' : false}
      dragConstraints={mounted ? { left: 0, right: 0 } : undefined}
      dragElastic={mounted ? 0.05 : undefined}
      onDragEnd={
        mounted
          ? (_event, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;

              if (swipe < -100 || offset.x < -50) {
                onSwipeLeft();
              } else if (swipe > 100 || offset.x > 50) {
                onSwipeRight();
              }
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
