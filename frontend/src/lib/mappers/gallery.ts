import type { GalleryItem } from '@/data/gallery';
import type { GalleryApiItem } from '@/lib/api/types';
import { resolvePublicImageSrc } from '@/lib/media';

export function mapGalleryApiItemToGalleryItem(item: GalleryApiItem): GalleryItem {
  return {
    id: item.id,
    src: resolvePublicImageSrc(item.src),
    category: item.category as GalleryItem['category'],
    title: item.title,
    subtitle: item.subtitle,
    aspectRatio: item.aspectRatio,
  };
}

export function mapGalleryApiItemsToGalleryItems(items: GalleryApiItem[]): GalleryItem[] {
  return items.map(mapGalleryApiItemToGalleryItem);
}
