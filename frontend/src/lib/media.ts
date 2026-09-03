import { getApiOrigin } from '@/lib/api/config';

function normalizeLeadingSlash(src: string): string {
  return src.startsWith('/') ? src : `/${src}`;
}

function normalizeUploadPath(src: string): string {
  if (src.startsWith('/uploads/')) {
    return src;
  }

  if (src.startsWith('uploads/')) {
    return `/${src}`;
  }

  return src;
}

function isUploadPath(src: string): boolean {
  return src.startsWith('/uploads/') || src.startsWith('uploads/');
}

function isPublicImagePath(src: string): boolean {
  return src.startsWith('/images/') || src.startsWith('images/');
}

function normalizeAssetPath(src: string): string {
  if (isUploadPath(src)) {
    return normalizeUploadPath(src);
  }

  if (isPublicImagePath(src)) {
    return normalizeLeadingSlash(src);
  }

  return src;
}

function shouldUseApiOriginForAsset(path: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.location.origin !== new URL(getApiOrigin()).origin;
  } catch {
    return false;
  }
}

function resolveAssetSrc(path: string): string {
  if (shouldUseApiOriginForAsset(path)) {
    return `${getApiOrigin()}${path}`;
  }

  return path;
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

  if (!trimmed) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (isUploadPath(trimmed) || isPublicImagePath(trimmed)) {
    return resolveAssetSrc(normalizeAssetPath(trimmed));
  }

  return trimmed;
}

export function resolveAbsoluteImageSrc(src: string | null | undefined): string {
  if (typeof src !== 'string' || !src.trim()) {
    return '';
  }

  const trimmed = src.trim();

  if (!trimmed) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (isUploadPath(trimmed) || isPublicImagePath(trimmed)) {
    return `${getApiOrigin()}${normalizeAssetPath(trimmed)}`;
  }

  return trimmed;
}
