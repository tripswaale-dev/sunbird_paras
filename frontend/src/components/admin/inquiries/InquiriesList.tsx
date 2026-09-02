'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import {
  CONTACT_INQUIRY_SUBJECT_OPTIONS,
  formatInquiryDate,
  getContactInquiries,
  getContactInquirySubjectLabel,
  type AdminContactInquiry,
  type ContactInquirySubject,
} from '@/lib/admin/contact-inquiries';
import type { AdminPaginationMeta } from '@/lib/admin/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function InquiriesTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-4 gap-4 rounded-lg border border-gray-100 bg-white p-4"
        >
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function InquiriesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const subject = (searchParams.get('subject') ?? '') as ContactInquirySubject | '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [inquiries, setInquiries] = useState<AdminContactInquiry[]>([]);
  const [meta, setMeta] = useState<AdminPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateParams = useCallback(
    (updates: { search?: string; subject?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.search !== undefined) {
        if (updates.search.trim()) {
          params.set('search', updates.search.trim());
        } else {
          params.delete('search');
        }
      }

      if (updates.subject !== undefined) {
        if (updates.subject) {
          params.set('subject', updates.subject);
        } else {
          params.delete('subject');
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set('page', String(updates.page));
        } else {
          params.delete('page');
        }
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getContactInquiries({
        search: search || undefined,
        subject: subject || undefined,
        page,
      });

      setInquiries(result.data);
      setMeta(result.meta);
    } catch (error) {
      setInquiries([]);
      setMeta(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load inquiries. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, subject]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput, page: 1 });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search, searchInput, updateParams]);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  const hasFilters = Boolean(search.trim() || subject);
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="inquiry-search" className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            id="inquiry-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, phone, or message"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:w-56">
          <label htmlFor="inquiry-subject" className="mb-1.5 block text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            id="inquiry-subject"
            value={subject}
            onChange={(event) =>
              updateParams({ subject: event.target.value, page: 1 })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All subjects</option>
            {CONTACT_INQUIRY_SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <InquiriesTableSkeleton />
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-lg"
            onClick={() => void loadInquiries()}
          >
            Retry
          </Button>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-900">
            {hasFilters ? 'No inquiries match your filters' : 'No inquiries yet'}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {hasFilters
              ? 'Try adjusting your search or subject filter.'
              : 'New contact form submissions will appear here.'}
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
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Received
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {inquiry.first_name} {inquiry.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{inquiry.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {getContactInquirySubjectLabel(inquiry.subject)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatInquiryDate(inquiry.created_at)}
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
