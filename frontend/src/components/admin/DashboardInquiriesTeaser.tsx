'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContactInquiries } from '@/lib/admin/contact-inquiries';

export function DashboardInquiriesTeaser() {
  const [total, setTotal] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const result = await getContactInquiries({ page: 1, per_page: 1 });

        if (!cancelled) {
          setTotal(result.meta.total);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage('Unable to load inquiry count.');
        }
      }
    }

    void loadCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/admin/inquiries"
      className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
    >
      <p className="text-sm font-medium text-gray-500">Contact Inquiries</p>
      {total !== null ? (
        <p className="mt-2 text-3xl font-semibold text-gray-900">{total}</p>
      ) : errorMessage ? (
        <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
      ) : (
        <p className="mt-2 text-sm text-gray-400">Loading...</p>
      )}
      <p className="mt-3 text-sm text-primary">View inbox →</p>
    </Link>
  );
}
