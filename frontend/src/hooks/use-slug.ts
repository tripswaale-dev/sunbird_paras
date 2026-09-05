'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * Resolves the slug from Next.js params first.
 * Falls back to extracting the last path segment from window.location
 * (needed for Apache fallback pages where useParams() returns nothing).
 */
export function useSlug(): string | undefined {
  const params = useParams<{ slug: string }>();
  const [pathSlug, setPathSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!params?.slug) {
      const segments = window.location.pathname.replace(/\/+$/, '').split('/');
      const last = segments[segments.length - 1];
      if (last && last !== 'fallback') {
        setPathSlug(last);
      }
    }
  }, [params?.slug]);

  return params?.slug ?? pathSlug;
}
