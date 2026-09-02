'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  getCustomerPromiseItem,
  isValidCustomerPromiseItemId,
  toCustomerPromiseItemFormValues,
  type AdminCustomerPromiseItem,
  type CustomerPromiseItemId,
} from '@/lib/admin/customer-promise-items';
import { CustomerPromiseItemForm } from '@/components/admin/homepage/CustomerPromiseItemForm';
import { Loader } from '@/components/ui/loader';

export default function AdminCustomerPromiseEditPage() {
  const params = useParams();
  const idParam = String(params.id ?? '');
  const isValidId = isValidCustomerPromiseItemId(idParam);

  const [item, setItem] = useState<AdminCustomerPromiseItem | null>(null);
  const [isLoading, setIsLoading] = useState(isValidId);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadItem = useCallback(async () => {
    if (!isValidId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getCustomerPromiseItem(Number(idParam) as CustomerPromiseItemId);
      setItem(data);
    } catch (error) {
      setItem(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load customer promise item. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [idParam, isValidId]);

  useEffect(() => {
    void loadItem();
  }, [loadItem]);

  if (!isValidId) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Promise not found</h1>
        <p className="mt-3 text-gray-600">
          &quot;{idParam}&quot; is not a valid customer promise item.
        </p>
        <Link
          href="/admin/homepage/promises"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to promises
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
        <h1 className="text-2xl font-semibold text-gray-900">Promise not found</h1>
        <p className="mt-3 text-gray-600">No customer promise item exists for this ID.</p>
        <Link
          href="/admin/homepage/promises"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to promises
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
          onClick={() => void loadItem()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <CustomerPromiseItemForm
      itemId={Number(idParam) as CustomerPromiseItemId}
      defaultValues={toCustomerPromiseItemFormValues(item)}
    />
  );
}
