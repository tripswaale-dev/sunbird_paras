'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { Button } from '@/components/ui/button';
import { journeyCategories } from '@/data/journey-categories';

// ===========================================
// Travel Your Way Section
// ===========================================


export function ChooseYourJourney() {
  return (
    <Section animate={false}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">

        {/* Left Content Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md space-y-6"
        >
          <div className="space-y-4">
            <h3 className="uppercase tracking-[0.25em] text-xs font-semibold text-secondary">
              CHOOSE YOUR JOURNEY
            </h3>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-primary leading-tight">
              Travel Your Way
            </h2>
          </div>

          <p className="text-gray-600 text-base leading-8 max-w-md">
            Whether you&apos;re an explorer, an adventure lover, a luxury traveller, or someone seeking peace, we have the perfect trip for you.
          </p>

          <div className="flex justify-center md:justify-start mt-8">
            <Button variant="pill-teal" size="pill-md" href="/travelyourway">
              Explore all
            </Button>
          </div>
        </motion.div>

        {/* Right Activity Grid */}
        <div className="grid grid-cols-2 gap-4 lg:gap-5">
          {journeyCategories.map((journey, index) => (
            <motion.div
              key={journey.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageOverlayCard
                title={journey.title}
                image={journey.image}
                href={`/travelyourway?category=${encodeURIComponent(journey.category)}`}
                overlayMode="always"
                className="h-[150px] lg:h-[190px] rounded-[22px]"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
}
