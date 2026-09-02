import Link from 'next/link';
import { Suspense } from 'react';
import { HomepageSavedBanner } from '@/components/admin/homepage/HomepageSavedBanner';

export default function AdminHomepagePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Homepage</h1>
          <p className="mt-1 text-sm text-gray-600">Hero and customer promise cards</p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-sm font-medium text-primary hover:underline"
        >
          View homepage
        </Link>
      </div>

      <Suspense fallback={null}>
        <HomepageSavedBanner />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/homepage/hero"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">Hero</h2>
          <p className="mt-2 text-sm text-gray-600">
            Background video, hero chips, and optional featured chip.
          </p>
          <p className="mt-4 text-sm font-medium text-primary">Edit hero</p>
        </Link>

        <Link
          href="/admin/homepage/promises"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">Customer promises</h2>
          <p className="mt-2 text-sm text-gray-600">
            Four promise cards shown below the hero section.
          </p>
          <p className="mt-4 text-sm font-medium text-primary">Edit promises</p>
        </Link>
      </div>
    </div>
  );
}
