import { apiGet, ApiError } from '@/lib/api/client';
import type { HomepageResponse } from '@/lib/api/types';
import { staticHomepage } from '@/data/homepage';

export async function getHomepage(): Promise<HomepageResponse> {
  try {
    return await apiGet<HomepageResponse>('/homepage');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const detail =
        error instanceof ApiError ? ` (${error.status})` : '';
      console.error(`Failed to fetch homepage${detail}; using static fallback.`);
    }

    return staticHomepage;
  }
}
