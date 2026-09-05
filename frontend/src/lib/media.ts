/**
 * Public asset URL helpers.
 *
 * Backend-hosted files (`/uploads`, `/images`, `/storage`) must always use
 * NEXT_PUBLIC_API_URL's origin — never BUILD_API_URL (that is local-only at build time).
 */

function getPublicApiOrigin(): string {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(
    /\/$/,
    ''
  );

  return baseUrl.replace(/\/api\/?$/, '');
}

function normalizeLeadingSlash(src: string): string {
  return src.startsWith('/') ? src : `/${src}`;
}

function isUploadPath(src: string): boolean {
  return src.startsWith('/uploads/') || src.startsWith('uploads/');
}

function isStoragePath(src: string): boolean {
  return src.startsWith('/storage/') || src.startsWith('storage/');
}

function isPublicImagePath(src: string): boolean {
  return src.startsWith('/images/') || src.startsWith('images/');
}

/** Paths that live on the Laravel public disk, not the Next.js frontend. */
export function isBackendAssetPath(src: string): boolean {
  return isUploadPath(src) || isStoragePath(src) || isPublicImagePath(src);
}

function normalizeBackendAssetPath(src: string): string {
  return normalizeLeadingSlash(src);
}

export function toUsableImageSrc(src: unknown): string | null {
  if (typeof src !== 'string') {
    return null;
  }

  const trimmed = src.trim();
  return trimmed ? trimmed : null;
}

export function resolvePublicImageSrc(src: string | null | undefined): string {
  if (typeof src !== 'string' || !src.trim()) {
    return '';
  }

  const trimmed = src.trim();

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (isBackendAssetPath(trimmed)) {
    return `${getPublicApiOrigin()}${normalizeBackendAssetPath(trimmed)}`;
  }

  return trimmed;
}

export function resolveAbsoluteImageSrc(src: string | null | undefined): string {
  if (typeof src !== 'string' || !src.trim()) {
    return '';
  }

  const trimmed = src.trim();

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (isBackendAssetPath(trimmed)) {
    return `${getPublicApiOrigin()}${normalizeBackendAssetPath(trimmed)}`;
  }

  if (trimmed.startsWith('/')) {
    const site =
      (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    return `${site}${trimmed}`;
  }

  return trimmed;
}
