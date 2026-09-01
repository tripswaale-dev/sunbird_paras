import { getSiteUrl } from '@/lib/utils';

export async function GET() {
  const sitemapUrl = `${getSiteUrl()}/sitemap.xml`;

  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
