'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { SwipeableMotionGrid } from '@/components/common/SwipeableMotionGrid';
import { CarouselButton } from '@/components/ui/carousel-button';
import { EmptyState } from '@/components/common/EmptyState';
import { BentoGridSkeleton } from '@/components/ui/skeleton';
import { bestOfIndiaGridClasses } from '@/data/best-of-india';
import type { BestOfIndiaDestination } from '@/data/best-of-india';
import { useApiData } from '@/hooks/use-api-data';
import { getBestOfIndiaDestinations } from '@/lib/api/sections';

export function BestOfIndia() {
  const fetcher = useCallback(() => getBestOfIndiaDestinations(), []);
  const { data: destinations, isLoading } = useApiData<BestOfIndiaDestination[]>(fetcher, []);

  const [startIndex, setStartIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const count = destinations.length;
  const visibleCount = Math.min(5, count);

  const nextSlide = () => {
    if (count === 0) return;
    setDirection(1);
    setStartIndex((prev) => (prev + visibleCount) % count);
  };

  const prevSlide = () => {
    if (count === 0) return;
    setDirection(-1);
    setStartIndex((prev) => (((prev - visibleCount) % count) + count) % count);
  };

  const visibleDestinations = Array.from({ length: visibleCount }, (_, i) => {
    return destinations[(startIndex + i) % count];
  });

  return (
    <Section>
      <SectionHeader
        title="Best of India"
        subtitle="Discover India's diverse landscapes and experiences"
        viewAllHref="/best-of-india"
      />

      {isLoading ? (
        <BentoGridSkeleton />
      ) : count > 0 ? (
        <div className="relative md:px-16">
          <CarouselButton
            direction="left"
            onClick={prevSlide}
            aria-label="Previous destinations"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
          />

          <SwipeableMotionGrid
            className="grid grid-cols-12 gap-5 touch-pan-y"
            onSwipeLeft={nextSlide}
            onSwipeRight={prevSlide}
          >
            {bestOfIndiaGridClasses.slice(0, visibleCount).map((slotClass, i) => {
              const dest = visibleDestinations[i];
              if (!dest) return null;

              return (
                <div
                  key={`slot-${i}`}
                  className={`${slotClass} relative overflow-hidden rounded-[28px]`}
                >
                  <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <motion.div
                      key={dest.title}
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <div className="w-full h-full pointer-events-auto">
                        <ImageOverlayCard
                          title={dest.title}
                          subtitle={dest.subtitle}
                          description={dest.duration}
                          image={dest.image}
                          href={dest.href}
                          overlayMode="hover"
                          className="w-full h-full m-0 rounded-none!"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              );
            })}
          </SwipeableMotionGrid>

          <CarouselButton
            direction="right"
            onClick={nextSlide}
            aria-label="Next destinations"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
          />
        </div>
      ) : (
        <EmptyState compact message="No packages yet" />
      )}
    </Section>
  );
}
