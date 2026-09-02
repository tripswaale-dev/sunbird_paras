import type { Metadata } from 'next';
import type { PackageDetailResponse } from '@/lib/api/types';
import type { Package } from '@/types/package';
import { resolveAbsoluteImageSrc } from '@/lib/media';

function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

function resolveOpenGraphImage(data: PackageDetailResponse): string | undefined {
  if (data.seo.og_image) {
    return resolveAbsoluteImageSrc(data.seo.og_image);
  }

  const galleryImage = data.images?.gallery?.[0]?.path;
  if (galleryImage) {
    return resolveAbsoluteImageSrc(galleryImage);
  }

  const heroImage = data.images?.hero?.[0]?.path;
  if (heroImage) {
    return resolveAbsoluteImageSrc(heroImage);
  }

  return data.image ? resolveAbsoluteImageSrc(data.image) : undefined;
}

function buildTitleMetadata(title: string): Metadata['title'] {
  return { absolute: title };
}

export function mapPackageDetailToMetadata(data: PackageDetailResponse): Metadata {
  const title = data.seo.meta_title ?? `${data.title} Tour Package | Sunbird Vacations`;
  const description =
    data.seo.meta_description ??
    truncateDescription(data.detail?.overview ?? '');

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

  const openGraphImage = resolveOpenGraphImage(data);
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

export function mapStaticPackageToMetadata(pkg: Package): Metadata {
  return {
    title: `${pkg.title} Tour Package | Sunbird Vacations`,
    description: `${pkg.overview.slice(0, 160)}...`,
  };
}
