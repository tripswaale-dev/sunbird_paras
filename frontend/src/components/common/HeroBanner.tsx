import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { resolvePublicImageSrc } from '@/lib/media';

interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  heightClass?: string;
  overlayClass?: string;
  contentPosition?: 'center' | 'bottom';
}

export function HeroBanner({
  image,
  title,
  subtitle,
  heightClass = 'h-[60vh] lg:h-[70vh]',
  overlayClass = 'bg-black/35',
  contentPosition = 'center',
}: HeroBannerProps) {
  const imageSrc = resolvePublicImageSrc(image) || image;

  return (
    <section className={cn(
      'relative flex justify-start',
      contentPosition === 'center' ? 'items-center' : 'items-end pb-16 lg:pb-24',
      heightClass
    )}>
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      <div className={cn('absolute inset-0', overlayClass)} />

      <Container className="relative z-10 text-white w-full">
        <h1 className="font-heading text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg lg:text-xl mt-4 max-w-2xl font-medium drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
