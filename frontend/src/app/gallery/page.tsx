import { Metadata } from 'next';
import { getGalleryItems } from '@/lib/api/gallery';
import { GalleryClient } from './gallery-client';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore our curated collection of stunning travel moments and beautiful destinations.',
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main className="bg-surface min-h-screen">
      <GalleryClient items={items} />
    </main>
  );
}
