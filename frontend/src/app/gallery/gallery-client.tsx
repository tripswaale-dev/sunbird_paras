'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryCategory, galleryCategories, galleryItems } from '@/data/gallery';
import { Lightbox } from '@/components/ui/lightbox';

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems = activeCategory === 'ALL' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Handle opening lightbox
  const openLightbox = (id: string) => {
    const index = filteredItems.findIndex(item => item.id === id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
      
      {/* Header & Filter Tabs */}
      <div className="flex flex-col items-center justify-center mb-16 space-y-12">
        
        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-8 border-b border-gray-200 pb-4 w-full max-w-4xl">
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-secondary text-white'
                  : 'text-gray-500 hover:text-black hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={item.id}
              className="relative break-inside-avoid overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => openLightbox(item.id)}
            >
              {/* Aspect Ratio Wrapper for smooth loading */}
              <div
                className={`relative w-full ${
                  item.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
                  item.aspectRatio === 'landscape' ? 'aspect-[4/3]' :
                  'aspect-square'
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/80 text-xs font-bold tracking-widest uppercase mb-2">
                    {item.category}
                  </span>
                  <h4 className="text-white text-xl font-heading font-medium">
                    {item.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={filteredItems}
        currentIndex={lightboxIndex ?? 0}
        onNavigate={setLightboxIndex}
      />
      
    </div>
  );
}
