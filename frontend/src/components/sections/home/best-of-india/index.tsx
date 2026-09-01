'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { CarouselButton } from '@/components/ui/carousel-button';
import { Button } from '@/components/ui/button';
import { bestOfIndiaGridClasses } from '@/data/best-of-india';
import type { BestOfIndiaDestination } from '@/data/best-of-india';

// ===========================================
// Best Of India Section
// ===========================================

interface BestOfIndiaProps {
  destinations: BestOfIndiaDestination[];
}

export function BestOfIndia({ destinations }: BestOfIndiaProps) {
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
    <Section>
      <SectionHeader
        title="Best of India"
        subtitle="Discover India's diverse landscapes and experiences"
        viewAllHref="/best-of-india"
      />

      {/* Carousel Container */}
      <div className="relative md:px-16">
        <CarouselButton
          direction="left"
          onClick={prevSlide}
          aria-label="Previous destinations"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
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
          {bestOfIndiaGridClasses.map((slotClass, i) => {
            const dest = visibleDestinations[i];
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
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
        </motion.div>

        <CarouselButton
          direction="right"
          onClick={nextSlide}
          aria-label="Next destinations"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-gray-100"
        />

      </div>
    </Section>
  );
}
