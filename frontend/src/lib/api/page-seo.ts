import { apiGet } from '@/lib/api/client';
import type { PageSeoResponse } from '@/lib/api/types';
import {
  mapPageSeoToMetadata,
  type PageMetadataFallback,
} from '@/lib/mappers/blog-metadata';
import { siteConfig } from '@/lib/utils';
import type { Metadata } from 'next';

const BLOG_LISTING_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Travel Blogs | Sunbird Vacations',
  description:
    'Read the latest travel tips, destination guides, and stories from Sunbird Vacations.',
};

const BLOG_LISTING_OG_IMAGE_FALLBACK = '/images/destinations/ladakh.jpg';

const HOME_METADATA_FALLBACK: PageMetadataFallback = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

const GALLERY_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Gallery',
  description:
    'Explore our curated collection of stunning travel moments and beautiful destinations.',
};

const PACKAGES_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Tour Packages | Sunbird Vacations',
  description:
    'Explore our premium tour packages to beautiful destinations including Kashmir, Kerala, Ladakh, and more.',
};

const SEARCH_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Search Results | Sunbird Vacations',
  description: 'Search for your next dream vacation package across India and beyond.',
};

const ABOUT_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'About Us | Sunbird Vacations',
  description:
    'Learn about Sunbird Vacations and our passion for crafting premium travel experiences across India and beyond.',
};

const CONTACT_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Contact Us | Sunbird Vacations',
  description:
    'Get in touch with our travel experts to plan your dream vacation. We are here to answer your questions and design your perfect itinerary.',
};

const PAYMENT_POLICY_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Payment Policy | Sunbird Vacations',
  description: 'Learn about our payment policies and terms for your bookings with Sunbird Vacations.',
};

const CANCELLATION_POLICY_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Cancellation & Refund Policy | Sunbird Vacations',
  description:
    'Learn about our cancellation, refund, and payment policies for your bookings with Sunbird Vacations.',
};

const DESTINATIONS_METADATA_FALLBACK: PageMetadataFallback = {
  title: 'Destinations | Sunbird Vacations',
  description:
    'Explore popular destinations, hill stations, beaches, spiritual journeys, wildlife, and international getaways with Sunbird Vacations.',
};

const PACKAGES_OG_IMAGE_FALLBACK = '/images/hero/travel-your-way.png';
const SEARCH_OG_IMAGE_FALLBACK = '/images/destinations/kerala.jpg';

export async function fetchPageSeo(pageKey: string): Promise<PageSeoResponse> {
  return apiGet<PageSeoResponse>(`/page-seo/${pageKey}`);
}

export async function getPageMetadata(
  pageKey: string,
  fallback: PageMetadataFallback,
  ogImageFallback?: string
): Promise<Metadata> {
  try {
    const data = await fetchPageSeo(pageKey);

    return mapPageSeoToMetadata(data, fallback, ogImageFallback);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to fetch page SEO for "${pageKey}"; using static fallback.`, error);
    }

    return {
      title: fallback.title,
      description: fallback.description,
    };
  }
}

function resolveAbsoluteTitle(metadata: Metadata, fallbackTitle: string): string {
  if (
    metadata.title &&
    typeof metadata.title === 'object' &&
    'absolute' in metadata.title &&
    metadata.title.absolute
  ) {
    return metadata.title.absolute;
  }

  if (typeof metadata.title === 'string') {
    return metadata.title;
  }

  return fallbackTitle;
}

export async function getHomeLayoutMetadata(): Promise<Metadata> {
  const seoMetadata = await getPageMetadata('home', HOME_METADATA_FALLBACK);
  const defaultTitle = resolveAbsoluteTitle(seoMetadata, HOME_METADATA_FALLBACK.title);
  const description = seoMetadata.description ?? HOME_METADATA_FALLBACK.description;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [
      'travel',
      'India tourism',
      'tour packages',
      'vacation',
      'holiday',
      'Sunbird Vacations',
      'destinations',
      'adventure',
      'spiritual tours',
      'hill stations',
    ],
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: defaultTitle,
      description,
      ...(seoMetadata.openGraph?.images ? { images: seoMetadata.openGraph.images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
    },
    alternates: seoMetadata.alternates,
    robots: seoMetadata.robots ?? {
      index: true,
      follow: true,
    },
  };
}

export async function getBlogListingMetadata(): Promise<Metadata> {
  return getPageMetadata('blogs', BLOG_LISTING_METADATA_FALLBACK, BLOG_LISTING_OG_IMAGE_FALLBACK);
}

export async function getGalleryMetadata(): Promise<Metadata> {
  return getPageMetadata('gallery', GALLERY_METADATA_FALLBACK);
}

export async function getPackagesMetadata(): Promise<Metadata> {
  return getPageMetadata('packages', PACKAGES_METADATA_FALLBACK, PACKAGES_OG_IMAGE_FALLBACK);
}

export async function getSearchMetadata(): Promise<Metadata> {
  return getPageMetadata('search', SEARCH_METADATA_FALLBACK, SEARCH_OG_IMAGE_FALLBACK);
}

export async function getAboutMetadata(): Promise<Metadata> {
  return getPageMetadata('about', ABOUT_METADATA_FALLBACK);
}

export async function getContactMetadata(): Promise<Metadata> {
  return getPageMetadata('contact', CONTACT_METADATA_FALLBACK);
}

export async function getPaymentPolicyMetadata(): Promise<Metadata> {
  return getPageMetadata('payment-policy', PAYMENT_POLICY_METADATA_FALLBACK);
}

export async function getCancellationPolicyMetadata(): Promise<Metadata> {
  return getPageMetadata('cancellation-policy', CANCELLATION_POLICY_METADATA_FALLBACK);
}

export async function getDestinationsMetadata(): Promise<Metadata> {
  return getPageMetadata('destinations', DESTINATIONS_METADATA_FALLBACK);
}
