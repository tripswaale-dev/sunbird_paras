import { apiGet } from '@/lib/api/client';
import type { GalleryApiData } from '@/lib/api/types';
import { mapGalleryApiItemsToGalleryItems } from '@/lib/mappers/gallery';
import type { GalleryItem } from '@/data/gallery';

export async function fetchGallery(): Promise<GalleryApiData> {
  return apiGet<GalleryApiData>('/gallery');
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const data = await fetchGallery();

    return mapGalleryApiItemsToGalleryItems(data.items);
  } catch {
    return [];
  }
}
