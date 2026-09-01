import type { Metadata } from 'next';
import type { Blog } from '@/data/blogsData';
import type { BlogDetail, BlogSeo } from '@/lib/api/types';

function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

function buildTitleMetadata(title: string): Metadata['title'] {
  return { absolute: title };
}

export function mapBlogDetailToMetadata(detail: BlogDetail): Metadata {
  const title = detail.seo.meta_title ?? `${detail.title} | Sunbird Vacations Blogs`;
  const description =
    detail.seo.meta_description ?? truncateDescription(detail.excerpt);

  const metadata: Metadata = {
    title: buildTitleMetadata(title),
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };

  if (detail.seo.canonical_url) {
    metadata.alternates = {
      canonical: detail.seo.canonical_url,
    };
  }

  const openGraphImage = detail.seo.og_image ?? detail.image;
  if (openGraphImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: openGraphImage }],
    };
  }

  if (detail.seo.is_indexable === false) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export function mapStaticBlogToMetadata(blog: Blog): Metadata {
  return {
    title: `${blog.title} | Sunbird Vacations Blogs`,
    description: truncateDescription(blog.excerpt),
  };
}

export interface PageMetadataFallback {
  title: string;
  description: string;
}

export function mapPageSeoToMetadata(
  data: { seo: BlogSeo },
  fallback: PageMetadataFallback,
  ogImageFallback?: string
): Metadata {
  const title = data.seo.meta_title ?? fallback.title;
  const description = data.seo.meta_description ?? fallback.description;

  const metadata: Metadata = {
    title: buildTitleMetadata(title),
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };

  if (data.seo.canonical_url) {
    metadata.alternates = {
      canonical: data.seo.canonical_url,
    };
  }

  const openGraphImage = data.seo.og_image ?? ogImageFallback;
  if (openGraphImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: openGraphImage }],
    };
  }

  if (data.seo.is_indexable === false) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export function mapStaticBlogListingToMetadata(fallback: PageMetadataFallback): Metadata {
  return {
    title: fallback.title,
    description: fallback.description,
  };
}
