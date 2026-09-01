import { getGalleryMetadata } from '@/lib/api/page-seo';
import { getGalleryItems } from '@/lib/api/gallery';
import { GalleryClient } from './gallery-client';

export async function generateMetadata() {
  return getGalleryMetadata();
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main className="bg-surface min-h-screen">
      <GalleryClient items={items} />
    </main>
  );
}
