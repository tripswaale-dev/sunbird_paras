"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/container";

interface PackageHeroProps {
  images: string[];
}

export const PackageHero = ({ images }: PackageHeroProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const mainImage = images[0];


  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <section className="pt-24 pb-8 bg-surface">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden relative">
            {/* Main Large Image (Left half) */}
            <div
              className="col-span-1 md:col-span-2 row-span-2 relative cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={mainImage}
                alt="Package Highlight"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Top Right Wide Image */}
            {images[1] && (
              <div
                className="hidden md:block col-span-2 row-span-1 relative cursor-pointer group"
                onClick={() => openLightbox(1)}
              >
                <Image
                  src={images[1]}
                  alt="Gallery Image 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            )}

            {/* Bottom Right Small Image 1 */}
            {images[2] && (
              <div
                className="hidden md:block col-span-1 row-span-1 relative cursor-pointer group"
                onClick={() => openLightbox(2)}
              >
                <Image
                  src={images[2]}
                  alt="Gallery Image 3"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            )}

            {/* Bottom Right Small Image 2 (with overlay) */}
            {images[3] && (
              <div
                className="hidden md:block col-span-1 row-span-1 relative cursor-pointer group"
                onClick={() => openLightbox(3)}
              >
                <Image
                  src={images[3]}
                  alt="Gallery Image 4"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                {images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-all group-hover:bg-black/70">
                    <span className="font-medium text-lg md:text-xl">See all images &gt;</span>
                  </div>
                )}
              </div>
            )}

            {/* View All Button for Mobile / Small Screens */}
            <div className="absolute bottom-4 right-4 md:hidden">
              <button
                onClick={() => openLightbox(0)}
                className="bg-white/90 backdrop-blur-md text-text px-4 py-2 rounded-lg font-medium shadow-elevated flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                See all {images.length} photos
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center group">
              <button
                onClick={prevImage}
                className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
              >
                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
              </button>

              <div className="relative w-full h-full max-w-5xl">
                <Image
                  src={images[currentImageIndex]}
                  alt={`Lightbox Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={nextImage}
                className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
              >
                <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
              </button>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center text-white/70">
              {currentImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
