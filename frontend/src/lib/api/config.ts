export function getApiBaseUrl(): string {
  if (typeof window === 'undefined' && process.env.BUILD_API_URL) {
    return process.env.BUILD_API_URL.replace(/\/$/, '');
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  return baseUrl.replace(/\/$/, '');
}

export function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}
