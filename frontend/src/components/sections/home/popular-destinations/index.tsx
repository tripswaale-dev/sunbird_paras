'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { CarouselButton } from '@/components/ui/carousel-button';
import { StatsCard } from '@/components/shared/stats-card';
import { popularDestinationsGridSlots } from '@/data/popular-destinations';
import type { PopularDestination, PopularStat } from '@/data/popular-destinations';

// ===========================================
// Popular Destinations Section
// ===========================================

interface PopularDestinationsProps {
  destinations: PopularDestination[];
  stats: PopularStat[];
}

export function PopularDestinations({ destinations, stats }: PopularDestinationsProps) {
  const [startIndex, setStartIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const nextSlide = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 5) % destinations.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    const len = destinations.length;
    setStartIndex((prev) => (((prev - 5) % len) + len) % len);
  };

  const visibleDestinations = Array.from({ length: 5 }).map((_, i) => {
    return destinations[(startIndex + i) % destinations.length];
  });

  return (
    <Section innerClassName="py-20">
      <SectionHeader
        title="Popular Destinations"
        subtitle="Handpicked experiences for every kind of traveller"
        viewAllHref="/popular-destinations"
      />

      {/* Bento Grid */}
      <div className="relative md:px-16 mt-8">
        <CarouselButton
          direction="left"
          onClick={prevSlide}
          aria-label="Previous destinations"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100 bg-white shadow-md"
        />
        
        <motion.div 
          className="grid grid-cols-12 gap-5 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -100 || offset.x < -50) {
              nextSlide();
            } else if (swipe > 100 || offset.x > 50) {
              prevSlide();
            }
          }}
        >
          {popularDestinationsGridSlots.map((slot, i) => {
            const dest = visibleDestinations[i];
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
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
        </motion.div>

        <CarouselButton
          direction="right"
          onClick={nextSlide}
          aria-label="Next destinations"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100 bg-white shadow-md"
        />
      </div>

      <StatsCard stats={stats} />
    </Section>
  );
}
