import { getApiBaseUrl } from '@/lib/api/config';
import type { ApiResponse } from '@/lib/api/types';

interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

async function buildFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  const response = await fetch(url, {
    ...init,
    cache: init?.cache ?? 'force-cache',
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Build fetch failed (${response.status}) for ${normalizedPath}`);
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!body.success) {
    throw new Error(`Build fetch unsuccessful for ${normalizedPath}`);
  }

  return body.data;
}

async function buildFetchPaginated<T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T[]; meta: PaginatedMeta }> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  const response = await fetch(url, {
    ...init,
    cache: init?.cache ?? 'force-cache',
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Build fetch failed (${response.status}) for ${normalizedPath}`);
  }

  const body = (await response.json()) as ApiResponse<T[]> & { meta?: PaginatedMeta };

  if (!body.success || !body.meta) {
    throw new Error(`Build paginated fetch unsuccessful for ${normalizedPath}`);
  }

  return { data: body.data, meta: body.meta };
}

function getBuildAdminHeaders(): HeadersInit | undefined {
  const token = process.env.BUILD_ADMIN_TOKEN;

  if (!token) {
    return undefined;
  }

  return { Authorization: `Bearer ${token}` };
}

async function fetchAllPaginated<T>(
  buildPath: (page: number) => string,
  init?: RequestInit
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const { data, meta } = await buildFetchPaginated<T>(buildPath(page), init);
    items.push(...data);
    lastPage = meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return items;
}

function numericIdRangeParams(min: number, max: number): { id: string }[] {
  return Array.from({ length: max - min + 1 }, (_, index) => ({
    id: String(min + index),
  }));
}

function dedupeIdParams(ids: string[]): { id: string }[] {
  const seen = new Set<string>();

  return ids
    .filter((id) => {
      if (!id || seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    })
    .map((id) => ({ id }));
}

async function fetchAdminNumericIds(adminPath: string): Promise<{ id: string }[]> {
  const headers = getBuildAdminHeaders();

  if (!headers) {
    return [];
  }

  const items = await fetchAllPaginated<{ id: number }>(
    (page) => `${adminPath}?per_page=50&page=${page}`,
    { headers }
  );

  return dedupeIdParams(items.map((item) => String(item.id)));
}

async function resolveAdminIdParams(
  adminPath: string,
  options: {
    publicFallback?: () => Promise<{ id: string }[]>;
    rangeFallback?: { min: number; max: number };
  } = {}
): Promise<{ id: string }[]> {
  // Always pre-generate a numeric ID range so newly created admin records
  // (not yet known at build/dev start) still work with output: 'export'.
  const range = options.rangeFallback ?? { min: 1, max: 50 };
  const discovered: string[] = numericIdRangeParams(range.min, range.max).map(
    (item) => item.id
  );

  try {
    const adminIds = await fetchAdminNumericIds(adminPath);
    discovered.push(...adminIds.map((item) => item.id));
  } catch {
    // Keep range ids; try public fallback next.
  }

  if (options.publicFallback) {
    try {
      const publicIds = await options.publicFallback();
      discovered.push(...publicIds.map((item) => item.id));
    } catch {
      // Range ids already included.
    }
  }

  return dedupeIdParams(discovered);
}

export async function getAllPackageSlugParams(): Promise<{ slug: string }[]> {
  try {
    const packages = await fetchAllPaginated<{ slug: string }>(
      (page) => `/packages?per_page=50&page=${page}`
    );

    return packages.map((pkg) => ({ slug: pkg.slug }));
  } catch {
    return [];
  }
}

export async function getSectionPackageSlugParams(
  sectionSlug: string
): Promise<{ slug: string }[]> {
  try {
    const data = await buildFetch<{ packages: { slug: string }[] }>(
      `/sections/${sectionSlug}/packages`
    );

    return data.packages.map((pkg) => ({ slug: pkg.slug }));
  } catch {
    return [];
  }
}

export async function getAllBlogSlugParams(): Promise<{ slug: string }[]> {
  try {
    const blogs = await buildFetch<{ slug: string }[]>('/blogs');

    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function getSectionIdParams(): Promise<{ id: string }[]> {
  return resolveAdminIdParams('/admin/sections', {
    publicFallback: async () => {
      const sections = await buildFetch<{ id: number }[]>('/sections');

      return dedupeIdParams(sections.map((section) => String(section.id)));
    },
    rangeFallback: { min: 1, max: 100 },
  });
}

export async function getPackageAdminIdParams(): Promise<{ id: string }[]> {
  return resolveAdminIdParams('/admin/packages', {
    publicFallback: async () => {
      const packages = await fetchAllPaginated<{ id: number }>(
        (page) => `/packages?per_page=50&page=${page}`
      );

      return dedupeIdParams(packages.map((pkg) => String(pkg.id)));
    },
    rangeFallback: { min: 1, max: 500 },
  });
}

export async function getAdminNumericIdParams(
  path: string
): Promise<{ id: string }[]> {
  return resolveAdminIdParams(path, {
    rangeFallback: { min: 1, max: 500 },
  });
}

export async function getDestinationCodeParams(): Promise<{ code: string }[]> {
  try {
    const data = await buildFetch<{
      categories: { code: string }[];
    }>('/destinations');

    return data.categories.map((category) => ({ code: category.code }));
  } catch {
    return [{ code: 'popular' }];
  }
}

export function getPageKeyParams(): { pageKey: string }[] {
  return [{ pageKey: 'about' }, { pageKey: 'contact' }];
}

export function getHomepagePromiseIdParams(): { id: string }[] {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}
