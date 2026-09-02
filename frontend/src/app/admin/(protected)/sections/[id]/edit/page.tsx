'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { adminSectionToFormValues, getSection, type AdminSection } from '@/lib/admin/sections';
import { SectionForm } from '@/components/admin/sections/SectionForm';
import { Loader } from '@/components/ui/loader';

export default function AdminSectionEditPage() {
  const params = useParams();
  const id = String(params.id ?? '');
  const [section, setSection] = useState<AdminSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSection = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getSection(id);
      setSection(data);
    } catch (error) {
      setSection(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load section. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadSection();
  }, [loadSection]);

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
        <h1 className="text-2xl font-semibold text-gray-900">Section not found</h1>
        <p className="mt-3 text-gray-600">
          This section may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/admin/sections"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to sections
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
          onClick={() => void loadSection()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!section) {
    return null;
  }

  return (
    <SectionForm
      mode="edit"
      sectionId={section.id}
      viewAllPath={section.view_all_path}
      defaultValues={adminSectionToFormValues(section)}
    />
  );
}
