'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Sparkles, Tag, Award, Sliders } from 'lucide-react'
import type { ProductGalleryProps, GalleryBadge } from './types'

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  badges = [],
  layout = 'horizontal',
  enableZoom = true,
  enableLightbox = true,
  initialImageIndex = 0,
  showImageCounter = true,
  aspectRatio = 1,
  borderRadius = 20,
  thumbnailCount = 5,
  enableSticky = true,
  stickyOffset = 100,
  onImageChange,
  onLightboxOpen,
  onLightboxClose,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(initialImageIndex)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const mainImgRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  // Limit thumbnails to thumbnailCount
  const visibleThumbnails = images.slice(0, thumbnailCount)

  // Handle image switch
  const handleImageSwitch = (index: number) => {
    setActiveIndex(index)
    onImageChange?.(index)

    // Announce to screen readers
    const announcement = `Afbeelding ${index + 1} van ${images.length} geselecteerd`
    announceToScreenReader(announcement)
  }

  // Open lightbox
  const handleLightboxOpen = () => {
    if (!enableLightbox) return

    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
    onLightboxOpen?.(activeIndex)
  }

  // Close lightbox
  const handleLightboxClose = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
    onLightboxClose?.()
  }

  // Navigate to previous image
  const handlePrevImage = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1
    handleImageSwitch(newIndex)
  }

  // Navigate to next image
  const handleNextImage = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0
    handleImageSwitch(newIndex)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return

      if (e.key === 'Escape') {
        handleLightboxClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, activeIndex, images.length])

  // Mobile swipe detection
  useEffect(() => {
    if (!mainImgRef.current || window.innerWidth >= 640) return

    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      const swipeThreshold = 50

      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left → next
        handleNextImage()
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right → prev
        handlePrevImage()
      }
    }

    const element = mainImgRef.current
    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeIndex, images.length])

  // Get badge icon
  const getBadgeIcon = (type: GalleryBadge['type']) => {
    switch (type) {
      case 'new':
        return Sparkles
      case 'sale':
        return Tag
      case 'pro':
        return Award
      case 'config':
        return Sliders
      default:
        return Sparkles
    }
  }

  // Get badge default label
  const getBadgeLabel = (badge: GalleryBadge) => {
    if (badge.label) return badge.label

    switch (badge.type) {
      case 'new':
        return 'Nieuw'
      case 'sale':
        return 'Sale'
      case 'pro':
        return 'Pro'
      case 'config':
        return 'Configureerbaar'
      default:
        return ''
    }
  }

  // Get badge position
  const getBadgePosition = (badge: GalleryBadge) => {
    if (badge.position) return badge.position
    return badge.type === 'config' ? 'top-right' : 'top-left'
  }

  // Get badge classes
  const getBadgeClasses = (badge: GalleryBadge) => {
    const position = getBadgePosition(badge)
    const baseClasses = 'absolute z-10 flex items-center gap-1 rounded-lg font-bold'

    if (position === 'top-right') {
      // Config badge (top-right)
      return `${baseClasses} top-3.5 right-3.5 bg-theme-navy/70 px-2.5 py-1 text-[11px] text-white backdrop-blur-lg`
    }

    // Standard badges (top-left)
    let colorClasses = ''
    switch (badge.type) {
      case 'new':
        colorClasses = 'bg-theme-teal text-white'
        break
      case 'sale':
        colorClasses = 'bg-theme-coral text-white'
        break
      case 'pro':
        colorClasses = 'bg-gradient-to-br from-theme-amber to-amber-600 text-white'
        break
      default:
        colorClasses = 'bg-theme-teal text-white'
    }

    return `${baseClasses} top-3.5 left-3.5 px-3 py-1.5 text-xs ${colorClasses}`
  }

  // Thumbnail grid component
  const ThumbnailGrid = () => (
    <div
      className={`${
        layout === 'vertical'
          ? 'flex flex-col gap-1.5 md:order-first'
          : 'grid grid-cols-4 gap-1 md:grid-cols-5 md:gap-1.5'
      }`}
      role="group"
      aria-label="Afbeelding miniaturen"
    >
      {visibleThumbnails.map((img, index) => (
        <button
          key={img.id}
          onClick={() => handleImageSwitch(index)}
          className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-150 md:rounded-[10px] ${
            index === activeIndex
              ? 'border-theme-teal shadow-[0_0_0_3px_rgba(0,137,123,0.12)]'
              : 'border-transparent hover:border-theme-teal'
          }`}
          aria-label={`Afbeelding ${index + 1} van ${images.length}: ${img.alt}`}
          aria-pressed={index === activeIndex}
        >
          <img
            src={img.thumbnail || img.url}
            alt=""
            className="h-full w-full bg-theme-grey-light object-cover text-2xl md:text-3xl"
          />
        </button>
      ))}
    </div>
  )

  return (
    <>
      {/* Gallery Container */}
      <div
        className={`product-gallery ${layout === 'vertical' ? 'md:grid md:grid-cols-[80px_1fr] md:gap-3' : ''} ${
          enableSticky ? 'md:sticky' : ''
        } ${className}`}
        style={
          enableSticky
            ? {
                top: `${stickyOffset}px`,
              }
            : undefined
        }
        role="region"
        aria-label="Product afbeeldingen"
      >
        {/* Vertical layout: thumbnails first on desktop */}
        {layout === 'vertical' && (
          <div className="hidden md:block">
            <ThumbnailGrid />
          </div>
        )}

        {/* Main Image */}
        <div className="relative">
          <figure
            ref={mainImgRef}
            onClick={handleLightboxOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleLightboxOpen()
              }
            }}
            className={`group relative mb-2.5 flex cursor-zoom-in items-center justify-center overflow-hidden border border-theme-grey bg-gradient-to-br from-theme-grey-light to-theme-grey transition-transform duration-200 md:mb-3 ${
              enableZoom ? 'hover:scale-[1.02] md:hover:scale-105' : ''
            }`}
            style={{
              aspectRatio: aspectRatio.toString(),
              borderRadius: `${borderRadius}px`,
            }}
            role="button"
            tabIndex={0}
            aria-label="Klik om te vergroten"
          >
            <img
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              className="h-full w-full object-cover"
            />

            {/* Badges */}
            {badges.map((badge, i) => {
              const Icon = getBadgeIcon(badge.type)
              const label = getBadgeLabel(badge)
              const classes = getBadgeClasses(badge)

              return (
                <div key={i} className={classes} aria-hidden="true">
                  <Icon className={getBadgePosition(badge) === 'top-right' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
                  {label}
                </div>
              )
            })}
          </figure>

          {/* Horizontal layout: thumbnails below */}
          {layout === 'horizontal' && <ThumbnailGrid />}

          {/* Mobile: show thumbnails for vertical layout too */}
          {layout === 'vertical' && (
            <div className="md:hidden">
              <ThumbnailGrid />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleLightboxClose()
            }
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-theme-navy/95 p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div className="relative h-full w-full max-w-[1200px]">
            {/* Close Button */}
            <button
              onClick={handleLightboxClose}
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-theme-navy transition-all hover:bg-theme-teal hover:text-white md:-top-12"
              aria-label="Sluit vergroting"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-theme-navy transition-all hover:scale-110 hover:bg-theme-teal hover:text-white md:left-6 md:h-12 md:w-12"
                aria-label="Vorige afbeelding"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            )}

            {/* Main Lightbox Image */}
            <div className="flex h-full items-center justify-center">
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                className="max-h-[90vh] w-full rounded-xl object-contain md:rounded-2xl"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-theme-navy transition-all hover:scale-110 hover:bg-theme-teal hover:text-white md:right-6 md:h-12 md:w-12"
                aria-label="Volgende afbeelding"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            )}

            {/* Image Counter */}
            {showImageCounter && images.length > 1 && (
              <div
                id="lightbox-title"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-theme-navy/80 px-4 py-2 text-sm font-bold text-white backdrop-blur-lg"
              >
                {activeIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Helper: Announce to screen readers
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => announcement.remove(), 1000)
}
