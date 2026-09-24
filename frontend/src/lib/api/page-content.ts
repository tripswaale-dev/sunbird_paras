import { aboutPageContent } from '@/data/about';
import { contactPageContent } from '@/data/contact';
import { apiGet, ApiError } from '@/lib/api/client';
import type { PageContentResponse } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

const PAGE_CONTENT_FALLBACKS: Record<string, PageContentResponse> = {
  about: aboutPageContent,
  contact: contactPageContent,
};

function withResolvedHeroImage(data: PageContentResponse): PageContentResponse {
  return {
    ...data,
    heroImage: resolvePublicImageSrc(data.heroImage),
  };
}

export async function fetchPageContent(pageKey: string): Promise<PageContentResponse> {
  const data = await apiGet<PageContentResponse>(`/page-content/${pageKey}`);

  return withResolvedHeroImage(data);
}

export async function getPageContent(pageKey: string): Promise<PageContentResponse> {
  try {
    return await fetchPageContent(pageKey);
  } catch (error) {
    const fallback = PAGE_CONTENT_FALLBACKS[pageKey];

    if (fallback) {
      if (process.env.NODE_ENV === 'development') {
        const detail = error instanceof ApiError ? ` (${error.status})` : '';
        console.error(
          `Failed to fetch page content for "${pageKey}"${detail}; using static fallback.`
        );
      }

      return withResolvedHeroImage(fallback);
    }

    throw error;
  }
}

export async function getAboutPageContent(): Promise<PageContentResponse> {
  return getPageContent('about');
}

export async function getContactPageContent(): Promise<PageContentResponse> {
  return getPageContent('contact');
}
