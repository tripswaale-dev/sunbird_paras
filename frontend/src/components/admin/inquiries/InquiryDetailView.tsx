'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/client';
import {
  formatInquiryDate,
  getContactInquiry,
  getContactInquirySubjectLabel,
  type AdminContactInquiry,
} from '@/lib/admin/contact-inquiries';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { InquiryNotFound } from '@/components/admin/inquiries/InquiryNotFound';

interface InquiryDetailViewProps {
  id: string;
}

export function InquiryDetailView({ id }: InquiryDetailViewProps) {
  const [inquiry, setInquiry] = useState<AdminContactInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInquiry = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getContactInquiry(id);
      setInquiry(data);
    } catch (error) {
      setInquiry(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load inquiry. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadInquiry();
  }, [loadInquiry]);

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isNotFound) {
    return <InquiryNotFound />;
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 rounded-lg"
          onClick={() => void loadInquiry()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!inquiry) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/inquiries"
        className="inline-flex text-sm font-medium text-primary hover:underline"
      >
        ← Back to inquiries
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {inquiry.first_name} {inquiry.last_name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Received {formatInquiryDate(inquiry.created_at)}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {getContactInquirySubjectLabel(inquiry.subject)}
          </span>
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-gray-900">{inquiry.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Subject</dt>
            <dd className="mt-1 text-gray-900">
              {getContactInquirySubjectLabel(inquiry.subject)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <dt className="text-sm font-medium text-gray-500">Message</dt>
          <dd className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-gray-900">
            {inquiry.message}
          </dd>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Metadata
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">IP address</dt>
              <dd className="mt-1 break-all text-gray-900">
                {inquiry.ip_address ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last updated</dt>
              <dd className="mt-1 text-gray-900">
                {formatInquiryDate(inquiry.updated_at)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">User agent</dt>
              <dd className="mt-1 break-all text-sm text-gray-700">
                {inquiry.user_agent ?? '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
