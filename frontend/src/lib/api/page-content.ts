import { apiGet } from '@/lib/api/client';
import type { PageContentResponse } from '@/lib/api/types';
import { aboutPageContent } from '@/data/about';
import { contactPageContent } from '@/data/contact';

export async function fetchPageContent(pageKey: string): Promise<PageContentResponse> {
  return apiGet<PageContentResponse>(`/page-content/${pageKey}`);
}

export async function getPageContent(
  pageKey: string,
  fallback: PageContentResponse
): Promise<PageContentResponse> {
  try {
    return await fetchPageContent(pageKey);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to fetch page content for "${pageKey}"; using static fallback.`, error);
    }

    return fallback;
  }
}

export async function getAboutPageContent(): Promise<PageContentResponse> {
  return getPageContent('about', aboutPageContent);
}

export async function getContactPageContent(): Promise<PageContentResponse> {
  return getPageContent('contact', contactPageContent);
}
