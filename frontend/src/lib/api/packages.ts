import type { Metadata } from 'next';
import { apiGet } from '@/lib/api/client';
import type { PackageDetailResponse, PackageSummary } from '@/lib/api/types';
import { mapPackageDetailToPackage } from '@/lib/mappers/package-detail';
import {
  mapPackageDetailToMetadata,
  mapStaticPackageToMetadata,
} from '@/lib/mappers/package-metadata';
import { mapPackageSummaryToRelatedPackage } from '@/lib/mappers/related-packages';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import {
  allTravelPackages,
  getPackageBySlug as getStaticPackageBySlug,
  getRelatedPackages as getStaticRelatedPackages,
} from '@/data/packages';
import type { TravelPackage } from '@/data/travelPackages';
import type { Package } from '@/types/package';

export async function fetchPackage(slug: string): Promise<PackageDetailResponse> {
  return apiGet<PackageDetailResponse>(`/packages/${slug}`);
}

export async function fetchPackages(params?: {
  category?: string;
  search?: string;
  per_page?: number;
  page?: number;
}): Promise<PackageSummary[]> {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.set('category', params.category);
  }

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.per_page) {
    searchParams.set('per_page', String(params.per_page));
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  const query = searchParams.toString();

  return apiGet<PackageSummary[]>(`/packages${query ? `?${query}` : ''}`);
}

export async function fetchAllPackageSummaries(): Promise<PackageSummary[]> {
  const perPage = 50;
  const packages: PackageSummary[] = [];
  let page = 1;

  while (true) {
    const batch = await fetchPackages({ per_page: perPage, page });

    packages.push(...batch);

    if (batch.length < perPage) {
      break;
    }

    page += 1;
  }

  return packages;
}

async function fetchSearchPackageSummaries(query: string): Promise<PackageSummary[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return fetchAllPackageSummaries();
  }

  const perPage = 50;
  const packages: PackageSummary[] = [];
  let page = 1;

  while (true) {
    const batch = await fetchPackages({
      search: trimmedQuery,
      per_page: perPage,
      page,
    });

    packages.push(...batch);

    if (batch.length < perPage) {
      break;
    }

    page += 1;
  }

  return packages;
}

function filterStaticPackagesByQuery(query: string): TravelPackage[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return allTravelPackages;
  }

  return allTravelPackages.filter((pkg) => {
    const searchString = `${pkg.title} ${pkg.category} ${pkg.duration}`.toLowerCase();
    return searchString.includes(normalizedQuery);
  });
}

export async function getSearchPackages(query: string): Promise<TravelPackage[]> {
  try {
    const summaries = await fetchSearchPackageSummaries(query);

    if (!summaries.length) {
      return query.trim() ? [] : allTravelPackages;
    }

    return mapPackageSummariesToTravelPackages(summaries);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch search packages for "${query}"; using static fallback.`,
        error
      );
    }

    return filterStaticPackagesByQuery(query);
  }
}

export async function getPackagesIndexListingPackages(): Promise<TravelPackage[]> {
  try {
    const summaries = await fetchAllPackageSummaries();

    if (!summaries.length) {
      return allTravelPackages;
    }

    return mapPackageSummariesToTravelPackages(summaries);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Failed to fetch packages index listing; using static fallback.',
        error
      );
    }

    return allTravelPackages;
  }
}

export async function getRelatedPackages(
  currentSlug: string,
  limit = 3
): Promise<Package[]> {
  try {
    const current = await fetchPackage(currentSlug);
    const summaries = current.category
      ? await fetchPackages({ category: current.category, per_page: limit + 1 })
      : await fetchPackages({ per_page: limit + 1 });

    const related = summaries
      .filter((summary) => summary.slug !== currentSlug)
      .slice(0, limit)
      .map(mapPackageSummaryToRelatedPackage);

    if (!related.length) {
      return getStaticRelatedPackages(currentSlug, limit);
    }

    return related;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch related packages for "${currentSlug}"; using static fallback.`,
        error
      );
    }

    return getStaticRelatedPackages(currentSlug, limit);
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  try {
    const data = await fetchPackage(slug);

    return mapPackageDetailToPackage(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch package "${slug}"; using static fallback.`,
        error
      );
    }

    return getStaticPackageBySlug(slug);
  }
}

export async function getPackageMetadata(slug: string): Promise<Metadata> {
  try {
    const data = await fetchPackage(slug);

    return mapPackageDetailToMetadata(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch package metadata for "${slug}"; using static fallback.`,
        error
      );
    }

    const pkg = getStaticPackageBySlug(slug);

    if (!pkg) {
      return {
        title: 'Package Not Found | Sunbird Vacations',
      };
    }

    return mapStaticPackageToMetadata(pkg);
  }
}
