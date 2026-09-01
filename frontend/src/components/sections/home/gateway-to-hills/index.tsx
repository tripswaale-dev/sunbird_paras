'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { ImageOverlayCard } from '@/components/common/ImageOverlayCard';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import type { HillDestination } from '@/data/hill-destinations';

// ===========================================
// Gateway To Hills Section
// ===========================================

interface GatewayToHillsProps {
  categories: HillDestination[];
}

export function GatewayToHills({ categories }: GatewayToHillsProps) {
  return (
    <Section bg="bg-surface" animate={false}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] items-center gap-12 lg:gap-16">

        {/* Left Content Area */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <SectionHeader
            title="Gateway to the Hills"
            subtitle="Escape to the serene and majestic mountains"
            viewAllHref="/gateway-to-the-hills"
            viewAllLabel="Explore all"
          />

          {/* Destination Grid */}
          <div className="grid grid-cols-2 gap-5 mt-10">
            {categories.map((dest, index) => (
              <ImageOverlayCard
                key={index}
                title={dest.title}
                image={dest.image}
                href={`/gateway-to-the-hills?category=${encodeURIComponent(dest.category)}`}
                overlayMode="always"
                featured={dest.featured}
                className={dest.featured ? 'h-[180px]' : 'h-[160px]'}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative h-[420px] lg:h-[600px] rounded-[28px] overflow-hidden shadow-2xl"
        >
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            src="/hills/lifestyle.png"
            alt="Traveller experiencing freedom in the hills"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

      </div>
    </Section>
  );
}
