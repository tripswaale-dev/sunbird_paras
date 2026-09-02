'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getDestinationCategoryLabel,
  isValidDestinationCategoryCode,
} from '@/lib/admin/destination-categories';

export function DestinationsSavedBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const savedCode = searchParams.get('saved') ?? '';
  const showBanner = isValidDestinationCategoryCode(savedCode);
  const [bannerVisible, setBannerVisible] = useState(showBanner);

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
      <span>{getDestinationCategoryLabel(savedCode)} category saved.</span>
      <button type="button" onClick={dismissBanner} className="font-medium hover:underline">
        Dismiss
      </button>
    </div>
  );
}
