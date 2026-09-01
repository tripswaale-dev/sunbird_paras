export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PackageDuration {
  nights: number;
  days: number;
  formatted: string;
  short: string;
}

export interface PackageSummary {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  location: string;
  price: number;
  duration: PackageDuration;
  category: string;
  tag: string | null;
  image: string;
  pax: number | null;
  display_order?: number;
  is_featured?: boolean;
  inclusions?: string[];
}

export interface SectionCategory {
  id: number;
  title: string;
  filter_value: string | null;
  image: string | null;
  is_featured: boolean;
  sort_order: number;
}

export interface SectionSeo {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  is_indexable: boolean;
}

export interface SectionDetail {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  view_all_path: string;
  hero_image: string | null;
  seo: SectionSeo;
  categories: SectionCategory[];
  stats: unknown[];
  packages: PackageSummary[];
}
