import { ApiError } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import { getApiBaseUrl } from '@/lib/admin/config';
import type { AdminPaginatedResult, AdminPaginationMeta } from '@/lib/admin/pagination';
import { clearAdminToken, getAdminToken } from '@/lib/admin/token';

type AdminRequestOptions = Omit<RequestInit, 'method' | 'body'>;

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}

async function parseAdminResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiResponse<T> & {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }

    throw new ApiError(
      json.message ?? `API request failed with status ${response.status}`,
      response.status,
      json.errors
    );
  }

  if (!json.success) {
    throw new ApiError(json.message ?? 'API request failed', response.status, json.errors);
  }

  return json.data;
}

async function parseAdminPaginatedResponse<T>(response: Response): Promise<AdminPaginatedResult<T>> {
  const json = (await response.json()) as ApiResponse<T[]> & {
    message?: string;
    errors?: Record<string, string[]>;
    meta?: AdminPaginationMeta;
  };

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminToken();
    }

    throw new ApiError(
      json.message ?? `API request failed with status ${response.status}`,
      response.status,
      json.errors
    );
  }

  if (!json.success) {
    throw new ApiError(json.message ?? 'API request failed', response.status, json.errors);
  }

  if (!json.meta) {
    throw new ApiError('Paginated API response is missing meta.', response.status);
  }

  return {
    data: json.data,
    meta: json.meta,
  };
}

export async function adminApiPostPublic<T, B = unknown>(
  path: string,
  body: B,
  init?: AdminRequestOptions
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  return parseAdminResponse<T>(response);
}

async function adminApiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  init?: AdminRequestOptions
): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    clearAdminToken();
    throw new ApiError('Not authenticated.', 401);
  }

  const response = await fetch(buildUrl(path), {
    method,
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  return parseAdminResponse<T>(response);
}

export function adminApiGet<T>(path: string, init?: AdminRequestOptions): Promise<T> {
  return adminApiRequest<T>('GET', path, undefined, init);
}

export async function adminApiGetPaginated<T>(
  path: string,
  init?: AdminRequestOptions
): Promise<AdminPaginatedResult<T>> {
  const token = getAdminToken();

  if (!token) {
    clearAdminToken();
    throw new ApiError('Not authenticated.', 401);
  }

  const response = await fetch(buildUrl(path), {
    method: 'GET',
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: 'no-store',
  });

  return parseAdminPaginatedResponse<T>(response);
}

export function adminApiPost<T, B = unknown>(
  path: string,
  body: B,
  init?: AdminRequestOptions
): Promise<T> {
  return adminApiRequest<T>('POST', path, body, init);
}

export async function adminApiUpload<T>(path: string, file: File): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    clearAdminToken();
    throw new ApiError('Not authenticated.', 401);
  }

  const body = new FormData();
  body.append('file', file);

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: 'no-store',
  });

  return parseAdminResponse<T>(response);
}

export function adminApiPut<T, B = unknown>(
  path: string,
  body: B,
  init?: AdminRequestOptions
): Promise<T> {
  return adminApiRequest<T>('PUT', path, body, init);
}

export function adminApiPatch<T, B = unknown>(
  path: string,
  body: B,
  init?: AdminRequestOptions
): Promise<T> {
  return adminApiRequest<T>('PATCH', path, body, init);
}

export function adminApiDelete<T = { message: string }>(
  path: string,
  init?: AdminRequestOptions
): Promise<T> {
  return adminApiRequest<T>('DELETE', path, undefined, init);
}
