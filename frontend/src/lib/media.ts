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

export function resolvePublicImageSrc(src: string | null | undefined): string {
  if (!src) {
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
  if (!src) {
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
