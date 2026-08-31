'use client';

import React from 'react';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { Carousel } from '@/components/common/Carousel';
import { PackageCard } from '@/components/common/PackageCard';
import { Button } from '@/components/ui/button';
import { spiritualPackages } from '@/data/spiritual-packages';

// ===========================================
// Spiritual Destinations Section
// ===========================================


export function SpiritualDestinations() {
  return (
    <Section bg="bg-surface-alt">
      <Carousel
        items={spiritualPackages}
        visibleCount={3}
        getKey={(pkg, i) => `${pkg.title}-${i}`}
        renderHeader={() => (
          <SectionHeader
            title="Spiritual Destinations"
            subtitle="Sacred journeys and soulful experiences across India"
            viewAllHref="/spiritual-destinations"
          />
        )}
        buttonPosition="sides"
        renderItem={(pkg) => (
          <PackageCard
            title={pkg.title}
            image={pkg.image}
            price={pkg.price}
            location={pkg.location}
            tag={pkg.tag}
          />
        )}
      />

      <div className="flex md:hidden justify-center mt-8">
        <Button variant="pill-teal" size="pill-md" href="/spiritual-destinations">
          View all
        </Button>
      </div>
    </Section>
  );
}
