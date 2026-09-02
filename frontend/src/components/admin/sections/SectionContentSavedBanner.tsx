'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const SECTION_CONTENT_SAVED_KEYS = [
  'packages',
  'category',
  'stat',
  'seo',
] as const;

export type SectionContentSavedKey = (typeof SECTION_CONTENT_SAVED_KEYS)[number];

const SAVED_LABELS: Record<SectionContentSavedKey, string> = {
  packages: 'Section packages saved.',
  category: 'Section category saved.',
  stat: 'Section stat saved.',
  seo: 'Section SEO saved.',
};

export function isValidSectionContentSavedKey(key: string): key is SectionContentSavedKey {
  return (SECTION_CONTENT_SAVED_KEYS as readonly string[]).includes(key);
}

export function SectionContentSavedBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const savedKey = searchParams.get('saved') ?? '';
  const showBanner = isValidSectionContentSavedKey(savedKey);
  const [bannerVisible, setBannerVisible] = useState(showBanner);

  useEffect(() => {
    setBannerVisible(showBanner);
  }, [showBanner]);

  const dismissBanner = useCallback(() => {
    setBannerVisible(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('saved');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  if (!bannerVisible || !showBanner) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <span>{SAVED_LABELS[savedKey]}</span>
      <button type="button" onClick={dismissBanner} className="font-medium hover:underline">
        Dismiss
      </button>
    </div>
  );
}
