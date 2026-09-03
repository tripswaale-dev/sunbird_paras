import { getApiBaseUrl } from '@/lib/api/config';

export async function fetchSitemapXml(): Promise<string> {
  const url = `${getApiBaseUrl()}/sitemap.xml`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Sitemap fetch failed with status ${response.status}`);
  }

  return response.text();
}

export function getMinimalSitemapXml(homepageUrl: string): string {
  const baseUrl = homepageUrl.replace(/\/$/, '');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${baseUrl}/</loc>`,
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}
