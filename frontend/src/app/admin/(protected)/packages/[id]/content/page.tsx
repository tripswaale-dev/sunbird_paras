'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { getPackage, type AdminPackage } from '@/lib/admin/packages';
import { PackageContentShell } from '@/components/admin/packages/PackageContentShell';
import { Loader } from '@/components/ui/loader';

export default function AdminPackageContentPage() {
  const params = useParams();
  const id = String(params.id ?? '');
  const [pkg, setPkg] = useState<AdminPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPackage = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getPackage(id);
      setPkg(data);
    } catch (error) {
      setPkg(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load package. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadPackage();
  }, [loadPackage]);

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
        <h1 className="text-2xl font-semibold text-gray-900">Package not found</h1>
        <p className="mt-3 text-gray-600">
          This package may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/admin/packages"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to packages
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
          onClick={() => void loadPackage()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!pkg) {
    return null;
  }

  return <PackageContentShell pkg={pkg} />;
}
