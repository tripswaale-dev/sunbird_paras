'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { SwipeableMotionGrid } from '@/components/common/SwipeableMotionGrid';
import { CarouselButton } from '@/components/ui/carousel-button';
import { StatsCard } from '@/components/shared/stats-card';
import { EmptyState } from '@/components/common/EmptyState';
import { BentoGridSkeleton, StatsSkeleton } from '@/components/ui/skeleton';
import { popularDestinationsGridSlots } from '@/data/popular-destinations';
import type { PopularDestination, PopularStat } from '@/data/popular-destinations';
import { useApiData } from '@/hooks/use-api-data';
import {
  getPopularDestinationsSection,
  type PopularDestinationsSectionData,
} from '@/lib/api/sections';

const EMPTY: PopularDestinationsSectionData = { destinations: [], stats: [] };

export function PopularDestinations() {
  const fetcher = useCallback(() => getPopularDestinationsSection(), []);
  const { data, isLoading } = useApiData<PopularDestinationsSectionData>(fetcher, EMPTY);
  const destinations = data.destinations;
  const stats = data.stats;

  const [startIndex, setStartIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const destinationCount = destinations.length;
  const visibleCount = Math.min(5, destinationCount);

  const nextSlide = () => {
    if (destinationCount === 0) return;
    setDirection(1);
    setStartIndex((prev) => (prev + visibleCount) % destinationCount);
  };

  const prevSlide = () => {
    if (destinationCount === 0) return;
    setDirection(-1);
    setStartIndex(
      (prev) => (((prev - visibleCount) % destinationCount) + destinationCount) % destinationCount
    );
  };

  const visibleDestinations = Array.from({ length: visibleCount }, (_, i) => {
    return destinations[(startIndex + i) % destinationCount];
  });

  return (
    <Section innerClassName="py-20">
      <SectionHeader
        title="Popular Destinations"
        subtitle="Handpicked experiences for every kind of traveller"
        viewAllHref="/popular-destinations"
      />

      {isLoading ? (
        <>
          <BentoGridSkeleton />
          <StatsSkeleton />
        </>
      ) : destinationCount > 0 ? (
        <div className="relative md:px-16 mt-8">
          <CarouselButton
            direction="left"
            onClick={prevSlide}
            aria-label="Previous destinations"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100 bg-white shadow-md"
          />

          <SwipeableMotionGrid
            className="grid grid-cols-12 gap-5 touch-pan-y"
            onSwipeLeft={nextSlide}
            onSwipeRight={prevSlide}
          >
            {popularDestinationsGridSlots.slice(0, visibleCount).map((slot, i) => {
              const dest = visibleDestinations[i];
              if (!dest) return null;

              return (
                <div
                  key={`slot-${i}`}
                  className={`${slot.colSpan} ${slot.rowSpan} ${slot.height} relative overflow-hidden rounded-[28px]`}
                >
                  <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <motion.div
                      key={dest.name}
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
                          title={dest.name}
                          subtitle={dest.location}
                          description={dest.duration}
                          image={dest.imageSrc}
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
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100 bg-white shadow-md"
          />
        </div>
      ) : (
        <EmptyState compact message="No destinations yet — start the API / add packages in admin." />
      )}

      {!isLoading && stats.length > 0 ? <StatsCard stats={stats} /> : null}
    </Section>
  );
}
