"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ImagePlaceholder, SafeImage } from "@/components/ui/safe-image";
import { resolvePublicImageSrc, toUsableImageSrc } from "@/lib/media";

interface PackageHeroProps {
  images: string[];
}

const tileClass =
  "relative overflow-hidden rounded-xl cursor-pointer group text-left w-full h-full";

export const PackageHero = ({ images }: PackageHeroProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const resolvedImages = images
    .map((src) => toUsableImageSrc(resolvePublicImageSrc(src)))
    .filter((src): src is string => Boolean(src));

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
    if (resolvedImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % resolvedImages.length);
  };

  const prevImage = () => {
    if (resolvedImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + resolvedImages.length) % resolvedImages.length);
  };

  if (resolvedImages.length === 0) {
    return (
      <section className="pt-24 pb-8 bg-surface">
        <Container>
          <div className="relative h-[320px] md:h-[420px] lg:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 bg-white p-2 md:p-2.5">
            <ImagePlaceholder
              className="absolute inset-2 md:inset-2.5 rounded-xl"
              label="Photos coming soon"
            />
          </div>
        </Container>
      </section>
    );
  }

  const mainImage = resolvedImages[0];
  const hasMosaic = resolvedImages.length >= 2;

  return (
    <>
      <section className="pt-24 pb-8 bg-surface">
        <Container>
          {/* Outer framed border like live package gallery */}
          <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-2 md:p-2.5">
            {!hasMosaic ? (
              <button
                type="button"
                className={`${tileClass} block h-[300px] sm:h-[360px] md:h-[400px] lg:h-[460px]`}
                onClick={() => openLightbox(0)}
                aria-label="Open gallery photo 1"
              >
                <SafeImage
                  src={mainImage}
                  alt="Package Highlight"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </button>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[1fr_1fr] gap-2 md:gap-2.5 h-[300px] sm:h-[360px] md:h-[400px] lg:h-[460px]">
                {/* Left: tall featured image */}
                <button
                  type="button"
                  className={`${tileClass} col-span-2 row-span-2`}
                  onClick={() => openLightbox(0)}
                  aria-label="Open gallery photo 1"
                >
                  <SafeImage
                    src={mainImage}
                    alt="Package Highlight"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  <span className="absolute bottom-3 right-3 md:hidden inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-text shadow-elevated">
                    <ImageIcon className="w-4 h-4" />
                    See all {resolvedImages.length} photos
                  </span>
                </button>

                {/* Top-right wide */}
                <button
                  type="button"
                  className={`${tileClass} hidden md:block col-span-2 row-span-1`}
                  onClick={() => openLightbox(1)}
                  aria-label="Open gallery photo 2"
                >
                  <SafeImage
                    src={resolvedImages[1]}
                    alt="Gallery Image 2"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </button>

                {/* Bottom-right left small */}
                <button
                  type="button"
                  className={`${tileClass} hidden md:block col-span-1 row-span-1`}
                  onClick={() => openLightbox(Math.min(2, resolvedImages.length - 1))}
                  aria-label="Open gallery photo 3"
                >
                  <SafeImage
                    src={resolvedImages[2] ?? resolvedImages[1]}
                    alt="Gallery Image 3"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </button>

                {/* Bottom-right: See all photos */}
                <button
                  type="button"
                  className={`${tileClass} hidden md:block col-span-1 row-span-1`}
                  onClick={() => openLightbox(Math.min(3, resolvedImages.length - 1))}
                  aria-label={`See all ${resolvedImages.length} photos`}
                >
                  <SafeImage
                    src={resolvedImages[3] ?? resolvedImages[2] ?? resolvedImages[1]}
                    alt="Gallery Image 4"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/65 flex flex-col items-center justify-center gap-1.5 text-white transition-colors duration-300">
                    <ImageIcon className="w-5 h-5 md:w-6 md:h-6 opacity-95" strokeWidth={1.75} />
                    <span className="font-medium text-sm md:text-base tracking-wide">
                      See all {resolvedImages.length} photos
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

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
              aria-label="Close gallery"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center group">
              <button
                onClick={prevImage}
                className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
              </button>

              <div className="relative w-full h-full max-w-5xl">
                <SafeImage
                  src={resolvedImages[currentImageIndex]}
                  alt={`Lightbox Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={nextImage}
                className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-50 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
              </button>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center text-white/70">
              {currentImageIndex + 1} / {resolvedImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
