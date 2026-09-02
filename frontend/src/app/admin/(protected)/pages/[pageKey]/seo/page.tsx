'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  getPageSeo,
  isValidPageSeoKey,
  toPageSeoFormValues,
  type AdminPageSeo,
} from '@/lib/admin/page-seo';
import { PageSeoForm } from '@/components/admin/pages/PageSeoForm';
import { Loader } from '@/components/ui/loader';

export default function AdminPageSeoEditPage() {
  const params = useParams();
  const pageKeyParam = String(params.pageKey ?? '');
  const isValidKey = isValidPageSeoKey(pageKeyParam);

  const [pageSeo, setPageSeo] = useState<AdminPageSeo | null>(null);
  const [isLoading, setIsLoading] = useState(isValidKey);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPageSeo = useCallback(async () => {
    if (!isValidKey) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getPageSeo(pageKeyParam);
      setPageSeo(data);
    } catch (error) {
      setPageSeo(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load page SEO. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isValidKey, pageKeyParam]);

  useEffect(() => {
    void loadPageSeo();
  }, [loadPageSeo]);

  if (!isValidKey) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600">
          &quot;{pageKeyParam}&quot; is not a valid page key.
        </p>
        <Link
          href="/admin/pages"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to pages
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Page SEO not found</h1>
        <p className="mt-3 text-gray-600">
          No SEO record exists for this page key.
        </p>
        <Link
          href="/admin/pages"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to pages
        </Link>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadPageSeo()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!pageSeo) {
    return null;
  }

  return (
    <PageSeoForm
      pageKey={pageKeyParam}
      defaultValues={toPageSeoFormValues(pageSeo)}
    />
  );
}
