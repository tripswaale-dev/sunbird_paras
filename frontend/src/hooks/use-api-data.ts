'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseApiDataResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Generic hook for client-side API data fetching.
 * Calls the provided fetcher on mount and returns { data, isLoading, error }.
 * While loading or on error the supplied fallback value is used.
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  fallback: T
): UseApiDataResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { data, isLoading, error };
}

/**
 * Defers fetching until the section is near the viewport.
 * Keeps the homepage hero path free of below-fold API stampede.
 */
export function useLazyApiData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  rootMargin = '280px 0px'
): UseApiDataResult<T> & { ref: (node: Element | null) => void } {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin });
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, fetcher]);

  return { ref, data, isLoading: !inView || isLoading, error };
}

/**
 * Variant that accepts a keyed fetcher (e.g. slug-based).
 * Re-fetches whenever the key changes.
 */
export function useApiDataByKey<T>(
  key: string | undefined,
  fetcher: (key: string) => Promise<T>,
  fallback: T
): UseApiDataResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!key) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await fetcher(key);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, fetcher]);

  return { data, isLoading, error };
}
