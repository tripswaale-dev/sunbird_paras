import { getApiBaseUrl } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';

const API_GET_MAX_ATTEMPTS = 3;
const API_GET_RETRY_DELAY_MS = 750;

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  // Browser: always fresh (backend off → empty UI). Build/SSR: cacheable for static export.
  const defaultCache: RequestCache =
    typeof window !== 'undefined' ? 'no-store' : 'force-cache';

  let response: Response | null = null;

  for (let attempt = 1; attempt <= API_GET_MAX_ATTEMPTS; attempt += 1) {
    response = await fetch(url, {
      ...init,
      cache: init?.cache ?? defaultCache,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });

    if (response.ok || response.status < 500 || attempt === API_GET_MAX_ATTEMPTS) {
      break;
    }

    await sleep(API_GET_RETRY_DELAY_MS * attempt);
  }

  if (!response) {
    throw new ApiError('API request failed', 0);
  }

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status);
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new ApiError(body.message ?? 'API request failed', response.status);
  }

  return body.data;
}

export async function apiPost<T, B = unknown>(path: string, body: B, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  const response = await fetch(url, {
    method: 'POST',
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as ApiResponse<T> & {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    throw new ApiError(
      json.message ?? `API request failed with status ${response.status}`,
      response.status,
      json.errors
    );
  }

  if (!json.success) {
    throw new ApiError(json.message ?? 'API request failed', response.status);
  }

  return json.data;
}
