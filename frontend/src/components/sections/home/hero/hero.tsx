import { Container } from '@/components/ui/container';
import { SearchBar } from '@/components/common/SearchBar';
import { SearchChip } from '@/components/common/SearchChip';
import { resolveHeroChipIcon } from '@/lib/mappers/homepage-icons';
import type { HomepageHeroChip, HomepageHeroData } from '@/lib/api/types';

// ===========================================
// Hero Section
// ===========================================

interface HeroProps extends HomepageHeroData {}

export function Hero({ backgroundVideo, chips, featuredChip }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary-900">
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/50" />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <Container className="relative z-10 flex flex-col items-center justify-center text-white min-h-[60vh] pt-32 pb-20 mt-16 md:mt-32">
        <SearchBar className="mb-8" />

        {/* Tags */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {chips.map((chip: HomepageHeroChip) => (
              <SearchChip
                key={chip.label}
                icon={resolveHeroChipIcon(chip.icon)}
                label={chip.label}
              />
            ))}
          </div>
          {featuredChip && (
            <div className="flex items-center justify-center">
              <SearchChip
                icon={resolveHeroChipIcon(featuredChip.icon)}
                label={featuredChip.label}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
