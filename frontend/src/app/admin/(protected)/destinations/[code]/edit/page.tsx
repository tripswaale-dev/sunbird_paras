'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  getDestinationCategory,
  isValidDestinationCategoryCode,
  toDestinationCategoryFormValues,
  type AdminDestinationCategory,
  type DestinationCategoryCode,
} from '@/lib/admin/destination-categories';
import { DestinationCategoryForm } from '@/components/admin/destinations/DestinationCategoryForm';
import { Loader } from '@/components/ui/loader';

export default function AdminDestinationCategoryEditPage() {
  const params = useParams();
  const codeParam = String(params.code ?? '');
  const isValidCode = isValidDestinationCategoryCode(codeParam);

  const [category, setCategory] = useState<AdminDestinationCategory | null>(null);
  const [isLoading, setIsLoading] = useState(isValidCode);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategory = useCallback(async () => {
    if (!isValidCode) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getDestinationCategory(codeParam as DestinationCategoryCode);
      setCategory(data);
    } catch (error) {
      setCategory(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load destination category. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [codeParam, isValidCode]);

  useEffect(() => {
    void loadCategory();
  }, [loadCategory]);

  if (!isValidCode) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Category not found</h1>
        <p className="mt-3 text-gray-600">
          &quot;{codeParam}&quot; is not a valid destination category code.
        </p>
        <Link
          href="/admin/destinations"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to destinations
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
        <h1 className="text-2xl font-semibold text-gray-900">Category not found</h1>
        <p className="mt-3 text-gray-600">No destination category exists for this code.</p>
        <Link
          href="/admin/destinations"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to destinations
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
          onClick={() => void loadCategory()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <DestinationCategoryForm
      code={codeParam as DestinationCategoryCode}
      category={category}
      defaultValues={toDestinationCategoryFormValues(category)}
    />
  );
}
