import { apiGet } from '@/lib/api/client';
import type { GalleryApiData } from '@/lib/api/types';
import { mapGalleryApiItemsToGalleryItems } from '@/lib/mappers/gallery';
import { galleryItems, type GalleryItem } from '@/data/gallery';

export async function fetchGallery(): Promise<GalleryApiData> {
  return apiGet<GalleryApiData>('/gallery');
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const data = await fetchGallery();

    if (!data.items.length) {
      return galleryItems;
    }

    return mapGalleryApiItemsToGalleryItems(data.items);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch gallery; using static fallback.', error);
    }

    return galleryItems;
  }
}
