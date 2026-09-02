'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  getHomepageHero,
  toHomepageHeroFormValues,
  type AdminHomepageHero,
} from '@/lib/admin/homepage-hero';
import { HomepageHeroForm } from '@/components/admin/homepage/HomepageHeroForm';
import { Loader } from '@/components/ui/loader';

export default function AdminHomepageHeroPage() {
  const [hero, setHero] = useState<AdminHomepageHero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHero = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getHomepageHero();
      setHero(data);
    } catch (error) {
      setHero(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load homepage hero. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHero();
  }, [loadHero]);

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadHero()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
        <div className="mt-4">
          <Link href="/admin/homepage" className="text-sm font-medium text-primary hover:underline">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!hero) {
    return null;
  }

  return <HomepageHeroForm defaultValues={toHomepageHeroFormValues(hero)} />;
}
