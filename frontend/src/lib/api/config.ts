export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  return baseUrl.replace(/\/$/, '');
}
