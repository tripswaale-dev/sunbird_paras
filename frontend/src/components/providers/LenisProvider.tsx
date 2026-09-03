'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      const html = document.documentElement;
      const body = document.body;
      const previousHtmlOverflow = html.style.overflow;
      const previousBodyOverflow = body.style.overflow;

      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';

      return () => {
        html.style.overflow = previousHtmlOverflow;
        body.style.overflow = previousBodyOverflow;
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();

    window.addEventListener('lenis:stop', handleStop);
    window.addEventListener('lenis:start', handleStart);

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('lenis:stop', handleStop);
      window.removeEventListener('lenis:start', handleStart);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
