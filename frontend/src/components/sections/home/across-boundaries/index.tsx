'use client';

import React from 'react';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/ui/section-header';
import { Carousel } from '@/components/common/Carousel';
import { PackageCard } from '@/components/common/PackageCard';
import { Button } from '@/components/ui/button';
import { internationalPackages } from '@/data/international-packages';

// ===========================================
// Across Boundaries Section
// ===========================================


export function AcrossBoundaries() {
  return (
    <Section>
      <Carousel
        items={internationalPackages}
        visibleCount={3}
        getKey={(pkg, i) => `${pkg.title}-${i}`}
        renderHeader={() => (
          <SectionHeader
            title="Across Boundaries"
            subtitle="International packages curated for best experiences"
            viewAllHref="/across-boundaries"
          />
        )}
        buttonPosition="sides"
        renderItem={(pkg) => <PackageCard {...pkg} />}
      />

      <div className="flex md:hidden justify-center mt-8">
        <Button variant="pill-teal" size="pill-md" href="/across-boundaries">
          View all
        </Button>
      </div>
    </Section>
  );
}
