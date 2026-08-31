import { Mountain, Umbrella, TreePine, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SearchBar } from '@/components/common/SearchBar';
import { SearchChip } from '@/components/common/SearchChip';

// ===========================================
// Hero Section
// ===========================================


const heroChips = [
  { icon: Mountain, label: 'Mountains' },
  { icon: Umbrella, label: 'Beaches' },
  { icon: TreePine, label: 'Nature' },
];

export function Hero() {
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
        <source src="/bg1.mp4" type="video/mp4" />
      </video>
      <Container className="relative z-10 flex flex-col items-center justify-center text-white min-h-[60vh] pt-32 pb-20 mt-16 md:mt-32">
        <SearchBar className="mb-8" />

        {/* Tags */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {heroChips.map((chip) => (
              <SearchChip key={chip.label} icon={chip.icon} label={chip.label} />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <SearchChip icon={MapPin} label="Trending in India" />
          </div>
        </div>
      </Container>
    </section>
  );
}
