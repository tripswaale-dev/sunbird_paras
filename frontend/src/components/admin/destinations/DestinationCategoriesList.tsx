'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/client';
import {
  getDestinationCategories,
  type AdminDestinationCategory,
} from '@/lib/admin/destination-categories';
import { cn } from '@/lib/utils';

function DestinationCategoriesTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-5 gap-4 rounded-lg border border-gray-100 bg-white p-4"
        >
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function DestinationCategoriesList() {
  const [categories, setCategories] = useState<AdminDestinationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getDestinationCategories();
      setCategories(data);
    } catch (error) {
      setCategories([]);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load destination categories. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  if (isLoading) {
    return <DestinationCategoriesTableSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadCategories()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="hidden border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:grid sm:grid-cols-[1fr_140px_100px_100px_80px] sm:gap-4">
        <span>Title</span>
        <span>Code</span>
        <span>Sort order</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {categories.map((category) => (
          <li
            key={category.code}
            className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_140px_100px_100px_80px] sm:items-center sm:gap-4"
          >
            <div>
              <p className="font-medium text-gray-900">{category.title}</p>
              <p className="mt-1 text-xs text-gray-500 sm:hidden">{category.code}</p>
            </div>
            <p className="hidden font-mono text-sm text-gray-600 sm:block">{category.code}</p>
            <p className="text-sm text-gray-600">{category.sort_order}</p>
            <span
              className={cn(
                'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium',
                category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              )}
            >
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            <div className="sm:text-right">
              <Link
                href={`/admin/destinations/${category.code}/edit`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
