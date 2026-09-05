'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    let cancelled = false;

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
    if (!key) return;

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
