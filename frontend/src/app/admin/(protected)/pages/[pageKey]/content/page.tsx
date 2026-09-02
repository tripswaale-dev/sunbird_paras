'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  getPageContent,
  isValidPageContentKey,
  toPageContentFormValues,
  type AdminPageContent,
} from '@/lib/admin/page-content';
import { PageContentForm } from '@/components/admin/pages/PageContentForm';
import { Loader } from '@/components/ui/loader';

export default function AdminPageContentEditPage() {
  const params = useParams();
  const pageKeyParam = String(params.pageKey ?? '');
  const isValidKey = isValidPageContentKey(pageKeyParam);

  const [pageContent, setPageContent] = useState<AdminPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(isValidKey);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPageContent = useCallback(async () => {
    if (!isValidKey) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getPageContent(pageKeyParam);
      setPageContent(data);
    } catch (error) {
      setPageContent(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load page content. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isValidKey, pageKeyParam]);

  useEffect(() => {
    void loadPageContent();
  }, [loadPageContent]);

  if (!isValidKey) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600">
          &quot;{pageKeyParam}&quot; is not a valid page content key.
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
        <h1 className="text-2xl font-semibold text-gray-900">Page content not found</h1>
        <p className="mt-3 text-gray-600">
          No content record exists for this page key.
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
          onClick={() => void loadPageContent()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!pageContent) {
    return null;
  }

  return (
    <PageContentForm
      pageKey={pageKeyParam}
      defaultValues={toPageContentFormValues(pageContent)}
    />
  );
}
