'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import {
  formatPackagePrice,
  getPackages,
  type AdminPackage,
} from '@/lib/admin/packages';
import type { AdminPaginationMeta } from '@/lib/admin/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function PackagesTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-7 gap-4 rounded-lg border border-gray-100 bg-white p-4"
        >
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
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

export function PackagesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const isActiveParam = searchParams.get('is_active') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const showDeletedBanner = searchParams.get('deleted') === '1';

  const [searchInput, setSearchInput] = useState(search);
  const [categoryInput, setCategoryInput] = useState(category);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [meta, setMeta] = useState<AdminPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(showDeletedBanner);

  const isActiveFilter =
    isActiveParam === 'true' ? true : isActiveParam === 'false' ? false : undefined;

  const updateParams = useCallback(
    (updates: {
      search?: string;
      category?: string;
      is_active?: string;
      page?: number;
      deleted?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.search !== undefined) {
        if (updates.search.trim()) {
          params.set('search', updates.search.trim());
        } else {
          params.delete('search');
        }
      }

      if (updates.category !== undefined) {
        if (updates.category.trim()) {
          params.set('category', updates.category.trim());
        } else {
          params.delete('category');
        }
      }

      if (updates.is_active !== undefined) {
        if (updates.is_active) {
          params.set('is_active', updates.is_active);
        } else {
          params.delete('is_active');
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set('page', String(updates.page));
        } else {
          params.delete('page');
        }
      }

      if (updates.deleted !== undefined) {
        if (updates.deleted) {
          params.set('deleted', updates.deleted);
        } else {
          params.delete('deleted');
        }
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getPackages({
        search: search || undefined,
        category: category || undefined,
        is_active: isActiveFilter,
        page,
      });

      setPackages(result.data);
      setMeta(result.meta);
    } catch (error) {
      setPackages([]);
      setMeta(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load packages. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [category, isActiveFilter, page, search]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setCategoryInput(category);
  }, [category]);

  useEffect(() => {
    setBannerVisible(showDeletedBanner);
  }, [showDeletedBanner]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput, page: 1, deleted: '' });
        setBannerVisible(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search, searchInput, updateParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (categoryInput !== category) {
        updateParams({ category: categoryInput, page: 1, deleted: '' });
        setBannerVisible(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [category, categoryInput, updateParams]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  const hasFilters = Boolean(search.trim() || category.trim() || isActiveParam);
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;

  function dismissBanner() {
    setBannerVisible(false);
    updateParams({ deleted: '' });
  }

  return (
    <div className="space-y-6">
      {bannerVisible ? (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>Package deleted successfully.</span>
          <button
            type="button"
            onClick={dismissBanner}
            className="font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="package-search" className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            id="package-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title, slug, location, or subtitle"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:w-48">
          <label
            htmlFor="package-category"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            id="package-category"
            type="text"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            placeholder="e.g. Mountains"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:w-48">
          <label htmlFor="package-active" className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="package-active"
            value={isActiveParam}
            onChange={(event) => {
              setBannerVisible(false);
              updateParams({ is_active: event.target.value, page: 1, deleted: '' });
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <PackagesTableSkeleton />
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-lg"
            onClick={() => void loadPackages()}
          >
            Retry
          </Button>
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-900">
            {hasFilters ? 'No packages match your filters' : 'No packages yet'}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {hasFilters
              ? 'Try adjusting your search, category, or status filter.'
              : 'Create your first package to get started.'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Tag
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="font-medium text-primary hover:underline"
                        >
                          {pkg.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pkg.category ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pkg.location ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatPackagePrice(pkg.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {pkg.duration.formatted}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pkg.tag ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                            pkg.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/packages/${pkg.id}/content`}
                            className="text-primary hover:underline"
                          >
                            Content
                          </Link>
                          <Link
                            href={`/admin/packages/${pkg.id}/edit`}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {lastPage}
              {meta ? ` · ${meta.total} total` : ''}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('rounded-lg', currentPage <= 1 && 'pointer-events-none opacity-50')}
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  'rounded-lg',
                  currentPage >= lastPage && 'pointer-events-none opacity-50'
                )}
                disabled={currentPage >= lastPage}
                onClick={() => updateParams({ page: currentPage + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
