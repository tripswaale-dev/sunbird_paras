import type { Metadata } from 'next';
import type { SectionDetail } from '@/lib/api/types';
import { resolveAbsoluteImageSrc } from '@/lib/media';

export interface StaticListingMetadataFallback {
  title: string;
  description: string;
}

function buildTitleMetadata(title: string): Metadata['title'] {
  return { absolute: title };
}

function resolveOpenGraphImage(section: SectionDetail): string | undefined {
  if (section.seo.og_image) {
    return resolveAbsoluteImageSrc(section.seo.og_image);
  }

  return section.hero_image ? resolveAbsoluteImageSrc(section.hero_image) : undefined;
}

export function mapSectionDetailToMetadata(
  section: SectionDetail,
  fallback: StaticListingMetadataFallback
): Metadata {
  const title = section.seo.meta_title ?? fallback.title;
  const description = section.seo.meta_description ?? fallback.description;

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

  if (section.seo.canonical_url) {
    metadata.alternates = {
      canonical: section.seo.canonical_url,
    };
  }

  const openGraphImage = resolveOpenGraphImage(section);
  if (openGraphImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: openGraphImage }],
    };
  }

  if (section.seo.is_indexable === false) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export function mapStaticListingToMetadata(
  fallback: StaticListingMetadataFallback
): Metadata {
  return {
    title: fallback.title,
    description: fallback.description,
  };
}
