import { apiGet } from '@/lib/api/client';
import type { BlogDetail, BlogSummary } from '@/lib/api/types';
import { fetchPackages } from '@/lib/api/packages';
import { mapBlogDetailToMetadata, mapStaticBlogToMetadata } from '@/lib/mappers/blog-metadata';
import { mapBlogDetailToBlog, mapBlogSummariesToBlogs } from '@/lib/mappers/blogs';
import { mapPackageSummariesToTravelPackages } from '@/lib/mappers/travel-packages';
import { blogsData, type Blog } from '@/data/blogsData';
import { travelPackages, type TravelPackage } from '@/data/travelPackages';
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

    if (!summaries.length) {
      return blogsData;
    }

    return mapBlogSummariesToBlogs(summaries);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch blogs listing; using static fallback.', error);
    }

    return blogsData;
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    const detail = await fetchBlog(slug);

    return mapBlogDetailToBlog(detail);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to fetch blog "${slug}"; using static fallback.`, error);
    }

    return blogsData.find((blog) => blog.slug === slug);
  }
}

export async function getBlogMetadata(slug: string): Promise<Metadata> {
  try {
    const detail = await fetchBlog(slug);

    return mapBlogDetailToMetadata(detail);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Failed to fetch blog metadata for "${slug}"; using static fallback.`,
        error
      );
    }

    const blog = blogsData.find((item) => item.slug === slug);

    if (!blog) {
      return {
        title: 'Blog Not Found | Sunbird Vacations',
      };
    }

    return mapStaticBlogToMetadata(blog);
  }
}

export async function getBlogFeaturedPackages(): Promise<TravelPackage[]> {
  try {
    const summaries = await fetchPackages({ per_page: 3 });

    if (!summaries.length) {
      return travelPackages.slice(0, 3);
    }

    return mapPackageSummariesToTravelPackages(summaries).slice(0, 3);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch blog featured packages; using static fallback.', error);
    }

    return travelPackages.slice(0, 3);
  }
}
