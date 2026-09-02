'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { AdminPackage } from '@/lib/admin/packages';
import { PackageContentSavedBanner } from '@/components/admin/packages/PackageContentSavedBanner';
import { PackageDetailTab } from '@/components/admin/packages/PackageDetailTab';
import { PackageFaqsTab } from '@/components/admin/packages/PackageFaqsTab';
import { PackageImagesTab } from '@/components/admin/packages/PackageImagesTab';
import { PackageItineraryTab } from '@/components/admin/packages/PackageItineraryTab';
import { PackageSeoTab } from '@/components/admin/packages/PackageSeoTab';
import { cn } from '@/lib/utils';

export const PACKAGE_CONTENT_TABS = [
  { id: 'detail', label: 'Detail' },
  { id: 'seo', label: 'SEO' },
  { id: 'images', label: 'Images' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'faqs', label: 'FAQs' },
] as const;

export type PackageContentTabId = (typeof PACKAGE_CONTENT_TABS)[number]['id'];

function isValidTab(tab: string): tab is PackageContentTabId {
  return PACKAGE_CONTENT_TABS.some((item) => item.id === tab);
}

interface PackageContentShellProps {
  pkg: AdminPackage;
}

function PackageContentShellInner({ pkg }: PackageContentShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'detail';
  const activeTab: PackageContentTabId = isValidTab(tabParam) ? tabParam : 'detail';

  function switchTab(tab: PackageContentTabId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('saved');

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pkg.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Package content · <span className="font-mono">{pkg.slug}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/admin/packages" className="font-medium text-primary hover:underline">
            ← Packages list
          </Link>
          <Link
            href={`/admin/packages/${pkg.id}/edit`}
            className="font-medium text-primary hover:underline"
          >
            Edit summary
          </Link>
          {pkg.is_active ? (
            <Link
              href={`/packages/${pkg.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View on site
            </Link>
          ) : null}
        </div>
      </div>

      <PackageContentSavedBanner />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-1">
          {PACKAGE_CONTENT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={cn(
                'rounded-t-lg px-4 py-2.5 text-sm font-medium transition',
                activeTab === tab.id
                  ? 'border border-b-white border-gray-200 bg-white text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'detail' ? <PackageDetailTab packageId={pkg.id} /> : null}
        {activeTab === 'seo' ? <PackageSeoTab packageId={pkg.id} /> : null}
        {activeTab === 'images' ? <PackageImagesTab packageId={pkg.id} /> : null}
        {activeTab === 'itinerary' ? <PackageItineraryTab packageId={pkg.id} /> : null}
        {activeTab === 'faqs' ? <PackageFaqsTab packageId={pkg.id} /> : null}
      </div>
    </div>
  );
}

export function PackageContentShell({ pkg }: PackageContentShellProps) {
  return (
    <Suspense fallback={null}>
      <PackageContentShellInner pkg={pkg} />
    </Suspense>
  );
}
