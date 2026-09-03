import { apiGet } from '@/lib/api/client';
import type { HomepageResponse } from '@/lib/api/types';

const EMPTY_HOMEPAGE: HomepageResponse = {
  hero: {
    backgroundVideo: '/bg1.mp4',
    chips: [],
    featuredChip: null,
  },
  customerPromises: [],
};

export async function getHomepage(): Promise<HomepageResponse> {
  try {
    return await apiGet<HomepageResponse>('/homepage');
  } catch {
    return EMPTY_HOMEPAGE;
  }
}
