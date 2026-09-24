import { getApiBaseUrl } from '@/lib/api/config';

export async function fetchSitemapXml(): Promise<string> {
  const url = `${getApiBaseUrl()}/sitemap.xml`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
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

/** Parse `<loc>` values from a sitemap XML document. */
export function parseSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;

  while ((match = re.exec(xml)) !== null) {
    const loc = match[1]?.trim();
    if (loc) {
      locs.push(loc);
    }
  }

  return locs;
}
