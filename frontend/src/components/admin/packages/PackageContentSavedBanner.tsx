'use client';

import { useEffect } from 'react';

export const PACKAGE_CONTENT_SAVED_KEYS = [
  'detail',
  'seo',
  'image',
  'itinerary',
  'faq',
] as const;

export type PackageContentSavedKey = (typeof PACKAGE_CONTENT_SAVED_KEYS)[number];

const SAVED_LABELS: Record<PackageContentSavedKey, string> = {
  detail: 'Package detail saved.',
  seo: 'Package SEO saved.',
  image: 'Package image saved.',
  itinerary: 'Itinerary day saved.',
  faq: 'FAQ saved.',
};

export function isValidPackageContentSavedKey(key: string): key is PackageContentSavedKey {
  return (PACKAGE_CONTENT_SAVED_KEYS as readonly string[]).includes(key);
}

interface PackageContentSavedBannerProps {
  savedKey: PackageContentSavedKey | null;
  onDismiss: () => void;
}

export function PackageContentSavedBanner({
  savedKey,
  onDismiss,
}: PackageContentSavedBannerProps) {
  useEffect(() => {
    if (!savedKey) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [savedKey, onDismiss]);

  if (!savedKey) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <span>{SAVED_LABELS[savedKey]}</span>
      <button type="button" onClick={onDismiss} className="font-medium hover:underline">
        Dismiss
      </button>
    </div>
  );
}
