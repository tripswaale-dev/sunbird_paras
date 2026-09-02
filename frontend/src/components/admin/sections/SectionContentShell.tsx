'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { AdminSection } from '@/lib/admin/sections';
import { SectionCategoriesTab } from '@/components/admin/sections/SectionCategoriesTab';
import { SectionContentSavedBanner } from '@/components/admin/sections/SectionContentSavedBanner';
import { SectionPackagesTab } from '@/components/admin/sections/SectionPackagesTab';
import { SectionSeoTab } from '@/components/admin/sections/SectionSeoTab';
import { SectionStatsTab } from '@/components/admin/sections/SectionStatsTab';
import { cn } from '@/lib/utils';

export const SECTION_CONTENT_TABS = [
  { id: 'packages', label: 'Packages' },
  { id: 'categories', label: 'Categories' },
  { id: 'stats', label: 'Stats' },
  { id: 'seo', label: 'SEO' },
] as const;

export type SectionContentTabId = (typeof SECTION_CONTENT_TABS)[number]['id'];

function isValidTab(tab: string): tab is SectionContentTabId {
  return SECTION_CONTENT_TABS.some((item) => item.id === tab);
}

interface SectionContentShellProps {
  section: AdminSection;
}

function SectionContentShellInner({ section }: SectionContentShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'packages';
  const activeTab: SectionContentTabId = isValidTab(tabParam) ? tabParam : 'packages';

  function switchTab(tab: SectionContentTabId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('saved');

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{section.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Section content · <span className="font-mono">{section.slug}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/admin/sections" className="font-medium text-primary hover:underline">
            ← Sections list
          </Link>
          <Link
            href={`/admin/sections/${section.id}/edit`}
            className="font-medium text-primary hover:underline"
          >
            Edit summary
          </Link>
          {section.is_active ? (
            <Link
              href={section.view_all_path}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View listing
            </Link>
          ) : null}
        </div>
      </div>

      <SectionContentSavedBanner />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-1">
          {SECTION_CONTENT_TABS.map((tab) => (
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
        {activeTab === 'packages' ? <SectionPackagesTab sectionId={section.id} /> : null}
        {activeTab === 'categories' ? <SectionCategoriesTab sectionId={section.id} /> : null}
        {activeTab === 'stats' ? <SectionStatsTab sectionId={section.id} /> : null}
        {activeTab === 'seo' ? <SectionSeoTab sectionId={section.id} /> : null}
      </div>
    </div>
  );
}

export function SectionContentShell({ section }: SectionContentShellProps) {
  return (
    <Suspense fallback={null}>
      <SectionContentShellInner section={section} />
    </Suspense>
  );
}
