import { getApiOrigin } from '@/lib/api/config';

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

  if (isUploadPath(trimmed)) {
    return normalizeUploadPath(trimmed);
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

  if (isUploadPath(trimmed)) {
    return `${getApiOrigin()}${normalizeUploadPath(trimmed)}`;
  }

  return trimmed;
}
