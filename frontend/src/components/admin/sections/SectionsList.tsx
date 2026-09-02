'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { getSections, type AdminSection } from '@/lib/admin/sections';
import { SectionDeleteButton } from '@/components/admin/sections/SectionDeleteButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function SectionsTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-6 gap-4 rounded-lg border border-gray-100 bg-white p-4"
        >
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

export function SectionsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showDeletedBanner = searchParams.get('deleted') === '1';

  const [sections, setSections] = useState<AdminSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(showDeletedBanner);

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getSections();
      setSections(data);
    } catch (error) {
      setSections([]);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load sections. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setBannerVisible(showDeletedBanner);
  }, [showDeletedBanner]);

  useEffect(() => {
    void loadSections();
  }, [loadSections]);

  function dismissBanner() {
    setBannerVisible(false);
    router.replace(pathname);
  }

  return (
    <div className="space-y-6">
      {bannerVisible ? (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>Section deleted successfully.</span>
          <button type="button" onClick={dismissBanner} className="font-medium hover:underline">
            Dismiss
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <SectionsTableSkeleton />
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-lg"
            onClick={() => void loadSections()}
          >
            Retry
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-900">No sections yet</p>
          <p className="mt-2 text-sm text-gray-600">Create your first section to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    View-all path
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
                {sections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{section.sort_order}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/sections/${section.id}/edit`}
                        className="font-medium text-primary hover:underline"
                      >
                        {section.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{section.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{section.view_all_path}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          section.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {section.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/sections/${section.id}/edit`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/sections/${section.id}/content`}
                          className="text-primary hover:underline"
                        >
                          Content
                        </Link>
                        <SectionDeleteButton
                          sectionId={section.id}
                          sectionTitle={section.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
