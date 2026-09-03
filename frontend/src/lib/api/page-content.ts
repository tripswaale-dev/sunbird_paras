import { apiGet } from '@/lib/api/client';
import type { PageContentResponse } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

export async function fetchPageContent(pageKey: string): Promise<PageContentResponse> {
  const data = await apiGet<PageContentResponse>(`/page-content/${pageKey}`);

  return {
    ...data,
    heroImage: resolvePublicImageSrc(data.heroImage),
  };
}

export async function getPageContent(pageKey: string): Promise<PageContentResponse> {
  return fetchPageContent(pageKey);
}

export async function getAboutPageContent(): Promise<PageContentResponse> {
  return getPageContent('about');
}

export async function getContactPageContent(): Promise<PageContentResponse> {
  return getPageContent('contact');
}
