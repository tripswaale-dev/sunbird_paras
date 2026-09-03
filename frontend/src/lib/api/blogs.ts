import { apiGet } from '@/lib/api/client';
import type { BlogDetail, BlogSummary } from '@/lib/api/types';
import { fetchPackages } from '@/lib/api/packages';
import { mapBlogDetailToMetadata } from '@/lib/mappers/blog-metadata';
import { mapBlogDetailToBlog, mapBlogSummariesToBlogs } from '@/lib/mappers/blogs';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import type { Blog } from '@/data/blogsData';
import type { TravelPackage } from '@/data/travelPackages';
import type { Metadata } from 'next';

export async function fetchBlogs(): Promise<BlogSummary[]> {
  return apiGet<BlogSummary[]>('/blogs');
}

export async function fetchBlog(slug: string): Promise<BlogDetail> {
  return apiGet<BlogDetail>(`/blogs/${slug}`);
}

export async function getBlogsListing(): Promise<Blog[]> {
  try {
    const summaries = await fetchBlogs();

    return mapBlogSummariesToBlogs(summaries);
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    const detail = await fetchBlog(slug);

    return mapBlogDetailToBlog(detail);
  } catch {
    return undefined;
  }
}

export async function getBlogMetadata(slug: string): Promise<Metadata> {
  try {
    const detail = await fetchBlog(slug);

    return mapBlogDetailToMetadata(detail);
  } catch {
    return {
      title: 'Blog Not Found | Sunbird Vacations',
    };
  }
}

export async function getBlogFeaturedPackages(): Promise<TravelPackage[]> {
  try {
    const summaries = await fetchPackages({ per_page: 3 });

    return mapPackageSummariesToTravelPackages(summaries).slice(0, 3);
  } catch {
    return [];
  }
}
