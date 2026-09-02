'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/client';
import {
  getCustomerPromiseItems,
  type AdminCustomerPromiseItem,
} from '@/lib/admin/customer-promise-items';
import { cn } from '@/lib/utils';
import { resolvePromiseIcon } from '@/lib/mappers/homepage-icons';

function CustomerPromiseTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
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

export function CustomerPromiseItemsList() {
  const [items, setItems] = useState<AdminCustomerPromiseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getCustomerPromiseItems();
      setItems(data);
    } catch (error) {
      setItems([]);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load customer promise items. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  if (isLoading) {
    return <CustomerPromiseTableSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadItems()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="hidden border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:grid sm:grid-cols-[48px_1fr_100px_100px_80px] sm:gap-4">
        <span>Icon</span>
        <span>Title</span>
        <span>Sort order</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item) => {
          const Icon = resolvePromiseIcon(item.icon);

          return (
            <li
              key={item.id}
              className="grid gap-3 px-4 py-4 sm:grid-cols-[48px_1fr_100px_100px_80px] sm:items-center sm:gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 sm:hidden">
                  {item.description}
                </p>
              </div>
              <p className="text-sm text-gray-600">{item.sort_order}</p>
              <span
                className={cn(
                  'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium',
                  item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                )}
              >
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
              <div className="sm:text-right">
                <Link
                  href={`/admin/homepage/promises/${item.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
