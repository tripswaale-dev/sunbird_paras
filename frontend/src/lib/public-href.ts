/** Keep internal paths compatible with `trailingSlash: true` (avoids 308 "Redirecting..."). */
export function withTrailingSlash(href: string): string {
  if (
    !href ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  ) {
    return href;
  }

  try {
    const url = new URL(href, 'http://local.invalid');
    if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href.endsWith('/') ? href : `${href}/`;
  }
}
