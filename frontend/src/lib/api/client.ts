import { getApiBaseUrl } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status);
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new ApiError(body.message ?? 'API request failed', response.status);
  }

  return body.data;
}
