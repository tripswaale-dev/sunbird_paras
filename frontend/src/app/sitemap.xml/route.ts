import { fetchSitemapXml, getMinimalSitemapXml } from '@/lib/seo/crawl-files';
import { getSiteUrl } from '@/lib/utils';

export async function GET() {
  try {
    const xml = await fetchSitemapXml();

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch sitemap from API; returning minimal fallback.',
        error
      );
    }

    const fallbackXml = getMinimalSitemapXml(getSiteUrl());

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
      },
    });
  }
}
