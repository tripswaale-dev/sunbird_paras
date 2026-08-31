'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; title: string; subtitle: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-110 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Main Content Area */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-12 py-16 md:py-12">
            
            {/* Image Wrapper */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center mb-8 group">
              
              {/* Previous Button */}
              <button
                onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-110 p-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Next Button */}
              <button
                onClick={() => onNavigate((currentIndex + 1) % images.length)}
                className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-110 p-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-full max-w-5xl">
                    <Image
                      src={currentImage.src}
                      alt={currentImage.title}
                      fill
                      className="object-contain"
                      quality={100}
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Caption */}
            <div className="flex flex-col items-center text-center px-4 shrink-0 mt-auto">
              <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-2">
                {currentImage.subtitle}
              </p>
              <h3 className="text-white font-heading text-2xl md:text-3xl font-medium mb-3">
                {currentImage.title}
              </h3>
              <p className="text-white/50 text-sm font-mono tracking-widest">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
