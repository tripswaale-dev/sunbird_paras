'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import {
  formatGalleryCategoryLabel,
  GALLERY_CATEGORY_OPTIONS,
  getGalleryItems,
  type AdminGalleryItem,
  type GalleryItemCategory,
} from '@/lib/admin/gallery-items';
import type { AdminPaginationMeta } from '@/lib/admin/pagination';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function GalleryTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-6 gap-4 rounded-lg border border-gray-100 bg-white p-4"
        >
          <div className="h-12 w-12 rounded bg-gray-200" />
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

export function GalleryItemsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = (searchParams.get('category') ?? '') as GalleryItemCategory | '';
  const isActiveParam = searchParams.get('is_active') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const showDeletedBanner = searchParams.get('deleted') === '1';

  const [searchInput, setSearchInput] = useState(search);
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
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
        if (updates.category) {
          params.set('category', updates.category);
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

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getGalleryItems({
        search: search || undefined,
        category: category || undefined,
        is_active: isActiveFilter,
        page,
      });

      setItems(result.data);
      setMeta(result.meta);
    } catch (error) {
      setItems([]);
      setMeta(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load gallery items. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [category, isActiveFilter, page, search]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

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
    void loadItems();
  }, [loadItems]);

  const hasFilters = Boolean(search.trim() || category || isActiveParam);
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
          <span>Gallery item deleted successfully.</span>
          <button
            type="button"
            onClick={dismissBanner}
            className="font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="gallery-search" className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            id="gallery-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title, subtitle, or external ID"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:w-48">
          <label htmlFor="gallery-category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="gallery-category"
            value={category}
            onChange={(event) => {
              setBannerVisible(false);
              updateParams({ category: event.target.value, page: 1, deleted: '' });
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All categories</option>
            {GALLERY_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:w-40">
          <label htmlFor="gallery-active" className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="gallery-active"
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
        <GalleryTableSkeleton />
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-lg"
            onClick={() => void loadItems()}
          >
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-900">
            {hasFilters ? 'No gallery items match your filters' : 'No gallery items yet'}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {hasFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first gallery item to get started.'}
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
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      External ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sort
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
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <GalleryImagePreview
                          src={item.src}
                          alt={item.title}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/gallery/${item.id}/edit`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.external_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatGalleryCategoryLabel(item.category)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.sort_order}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                            item.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          href={`/admin/gallery/${item.id}/edit`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </Link>
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
