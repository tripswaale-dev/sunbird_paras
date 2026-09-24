import type { MetadataRoute } from 'next';

import { fetchSitemapXml, parseSitemapLocs } from '@/lib/seo/crawl-files';
import { getSiteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homepage = `${getSiteUrl()}/`;

  try {
    const xml = await fetchSitemapXml();
    const locs = parseSitemapLocs(xml);

    if (locs.length === 0) {
      return [{ url: homepage }];
    }

    return locs.map((url) => ({ url }));
  } catch {
    return [{ url: homepage }];
  }
}
