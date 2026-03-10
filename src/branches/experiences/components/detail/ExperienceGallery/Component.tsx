'use client'

import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ExperienceGalleryProps } from './types'

export const ExperienceGallery: React.FC<ExperienceGalleryProps> = ({
  images,
  badge,
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!images || images.length === 0) return null

  // Pad to at least 5 for grid, or use what we have
  const gridImages = images.slice(0, 5)
  const totalCount = images.length

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  }

  return (
    <>
      {/* Gallery Grid: 3 columns, 2 rows */}
      <div
        className={`grid grid-cols-1 gap-2 md:grid-cols-3 md:grid-rows-2 ${className}`}
        style={{ minHeight: '360px' }}
      >
        {/* Main image — spans 2 rows on md+ */}
        <div
          className="relative cursor-pointer overflow-hidden rounded-2xl md:col-span-1 md:row-span-2"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          aria-label={gridImages[0]?.alt || 'Hoofdafbeelding openen'}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
        >
          <img
            src={gridImages[0].url}
            alt={gridImages[0].alt || 'Ervaring afbeelding 1'}
            className="h-full min-h-[240px] w-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Badge top-left */}
          {badge && (
            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold text-white shadow-sm"
              style={{ backgroundColor: 'var(--color-coral, #ff6b6b)' }}
            >
              {badge}
            </span>
          )}

          {/* Photo counter bottom-right */}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
            1/{totalCount}
          </span>
        </div>

        {/* Remaining 4 images */}
        {gridImages.slice(1).map((image, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => openLightbox(idx + 1)}
            role="button"
            tabIndex={0}
            aria-label={image.alt || `Afbeelding ${idx + 2} openen`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx + 1)}
          >
            <img
              src={image.url}
              alt={image.alt || `Ervaring afbeelding ${idx + 2}`}
              className="h-full min-h-[120px] w-full object-cover transition-transform duration-300 hover:scale-105"
            />

            {/* Video badge */}
            {image.isVideo && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                &#9654; Video
              </span>
            )}

            {/* Show "+X more" on last visible image if there are more */}
            {idx === gridImages.length - 2 && totalCount > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-lg font-bold text-white">
                  +{totalCount - 5} meer
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Afbeelding lightbox"
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Sluiten"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Vorige afbeelding"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || `Afbeelding ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <div className="mt-3 text-center text-sm text-white/70">
              {lightboxIndex + 1} / {totalCount}
              {images[lightboxIndex].alt && (
                <span className="ml-2">&mdash; {images[lightboxIndex].alt}</span>
              )}
            </div>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Volgende afbeelding"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
