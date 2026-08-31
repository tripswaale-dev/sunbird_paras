import { Metadata } from 'next';
import { GalleryClient } from './gallery-client';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore our curated collection of stunning travel moments and beautiful destinations.',
};

export default function GalleryPage() {
  return (
    <main className="bg-surface min-h-screen">
      <GalleryClient />
    </main>
  );
}
