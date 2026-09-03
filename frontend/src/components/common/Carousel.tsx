'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CarouselButton } from '@/components/ui/carousel-button';

interface CarouselProps<T> {
  items: T[];
  visibleCount: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  /** Grid classes for the items container */
  gridClassName?: string;
  /** 'header' puts nav buttons in header area, 'sides' puts them beside the carousel */
  buttonPosition?: 'header' | 'sides';
  /** Render prop for header area — receives prev/next handlers and optional nav buttons */
  renderHeader?: (props: {
    prevSlide: () => void;
    nextSlide: () => void;
    navButtons: React.ReactNode;
  }) => React.ReactNode;
  className?: string;
}

export function Carousel<T>({
  items,
  visibleCount,
  renderItem,
  getKey,
  gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  buttonPosition = 'sides',
  renderHeader,
  className,
}: CarouselProps<T>) {
  const [startIndex, setStartIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const itemCount = items.length;
  const slotCount = Math.min(visibleCount, itemCount);

  const nextSlide = () => {
    if (itemCount === 0) {
      return;
    }

    setDirection(1);
    setStartIndex((prev) => (prev + visibleCount) % itemCount);
  };

  const prevSlide = () => {
    if (itemCount === 0) {
      return;
    }

    setDirection(-1);
    setStartIndex((prev) => (((prev - visibleCount) % itemCount) + itemCount) % itemCount);
  };

  const visibleItems = Array.from({ length: slotCount }, (_, i) => {
    return items[(startIndex + i) % itemCount];
  });

  const navButtons = (
    <>
      <CarouselButton
        direction="left"
        onClick={prevSlide}
        aria-label="Previous"
        className="hidden md:flex"
      />
      <CarouselButton
        direction="right"
        onClick={nextSlide}
        aria-label="Next"
        className="hidden md:flex"
      />
    </>
  );

  const sideNavLeft = (
    <CarouselButton
      direction="left"
      onClick={prevSlide}
      aria-label="Previous"
      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
    />
  );

  const sideNavRight = (
    <CarouselButton
      direction="right"
      onClick={nextSlide}
      aria-label="Next"
      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
    />
  );

  return (
    <div className={className}>
      {renderHeader?.({ prevSlide, nextSlide, navButtons })}

      {itemCount === 0 ? null : (
      <div className={buttonPosition === 'sides' ? 'relative md:px-16' : ''}>
        {buttonPosition === 'sides' && sideNavLeft}

        <div className={gridClassName}>
          {visibleItems.map((item, i) => {
            return (
              <div key={`slot-${i}`} className="relative h-full w-full overflow-hidden rounded-[20px]">
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={getKey(item, i)}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    {renderItem(item, i)}
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {buttonPosition === 'sides' && sideNavRight}
      </div>
      )}
    </div>
  );
}
