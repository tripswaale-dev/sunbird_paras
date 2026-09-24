import { getApiBaseUrl } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';

const API_GET_MAX_ATTEMPTS = 3;
const API_GET_RETRY_DELAY_MS = 750;
/** Browser memory cache — collapses Strict Mode doubles + remount refetches. */
const BROWSER_GET_TTL_MS = 45_000;
/** Cap parallel browser GETs so PHP is not stampeded on homepage mount. */
const MAX_BROWSER_CONCURRENT = 2;

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

type CacheEntry = { expires: number; data: unknown };

const browserGetCache = new Map<string, CacheEntry>();
const browserInflight = new Map<string, Promise<unknown>>();
let browserActiveNetwork = 0;
const browserNetworkQueue: Array<() => void> = [];

function browserCacheKey(url: string, cacheMode: RequestCache): string {
  return `${cacheMode}:${url}`;
}

async function withBrowserConcurrency<T>(fn: () => Promise<T>): Promise<T> {
  if (browserActiveNetwork >= MAX_BROWSER_CONCURRENT) {
    await new Promise<void>((resolve) => {
      browserNetworkQueue.push(resolve);
    });
  }

  browserActiveNetwork += 1;
  try {
    return await fn();
  } finally {
    browserActiveNetwork -= 1;
    const next = browserNetworkQueue.shift();
    if (next) {
      next();
    }
  }
}

async function apiGetNetwork<T>(
  url: string,
  cacheMode: RequestCache,
  init?: RequestInit
): Promise<T> {
  let response: Response | null = null;

  for (let attempt = 1; attempt <= API_GET_MAX_ATTEMPTS; attempt += 1) {
    response = await fetch(url, {
      ...init,
      cache: cacheMode,
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

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  // Browser: memory TTL + inflight dedupe. Build/SSR: Next force-cache for static export.
  const defaultCache: RequestCache =
    typeof window !== 'undefined' ? 'no-store' : 'force-cache';
  const cacheMode = init?.cache ?? defaultCache;
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && cacheMode === 'no-store') {
    const key = browserCacheKey(url, cacheMode);
    const cached = browserGetCache.get(key);

    if (cached && cached.expires > Date.now()) {
      return cached.data as T;
    }

    const inflight = browserInflight.get(key);
    if (inflight) {
      return inflight as Promise<T>;
    }

    const request = withBrowserConcurrency(() => apiGetNetwork<T>(url, cacheMode, init))
      .then((data) => {
        browserGetCache.set(key, { expires: Date.now() + BROWSER_GET_TTL_MS, data });
        return data;
      })
      .finally(() => {
        browserInflight.delete(key);
      });

    browserInflight.set(key, request);
    return request;
  }

  return apiGetNetwork<T>(url, cacheMode, init);
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
