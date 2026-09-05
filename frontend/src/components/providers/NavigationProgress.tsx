'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`;
  const prevRoute = useRef(routeKey);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      if (anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }
      } catch {
        return;
      }

      if (hideTimer.current) clearTimeout(hideTimer.current);
      setActive(true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (prevRoute.current === routeKey) return;
    prevRoute.current = routeKey;

    setActive(true);

    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setActive(false);
    }, 400);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [routeKey]);

  if (!active) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-1 overflow-hidden bg-primary/10"
        aria-hidden="true"
      >
        <div className="h-full w-1/2 animate-[navProgress_0.85s_ease-in-out_infinite] bg-primary" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[150] flex items-start justify-center bg-surface/50 pt-[28vh] backdrop-blur-[1px]"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="rounded-2xl bg-white px-6 py-5 shadow-lg">
          <Loader size="md" />
        </div>
      </div>
    </>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
