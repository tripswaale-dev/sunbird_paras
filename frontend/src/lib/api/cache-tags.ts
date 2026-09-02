export const PUBLIC_CACHE_TAG = 'public-api';

export function resolvePublicCacheTags(path: string): string[] {
  const segment = path.replace(/^\/+/, '').split(/[/?]/)[0];

  return segment ? [PUBLIC_CACHE_TAG, `${PUBLIC_CACHE_TAG}:${segment}`] : [PUBLIC_CACHE_TAG];
}
