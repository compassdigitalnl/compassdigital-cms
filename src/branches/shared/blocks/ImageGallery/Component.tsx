import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { ImageGalleryBlockProps, ImageGalleryVariant, ImageGalleryAspectRatio, ImageGalleryGap, GalleryImage } from './types'
import type { Media } from '@/payload-types'

/**
 * B-20 ImageGallery Block Component (Server)
 *
 * Responsive image gallery with multiple layout variants.
 *
 * Variants:
 * - grid: Equal columns (2/3/4)
 * - featured-grid: First image spans 2 cols + full height, rest fill remaining space
 * - masonry: CSS columns with auto height
 */

const aspectClasses: Record<ImageGalleryAspectRatio, string> = {
  '16-9': 'aspect-video',
  '4-3': 'aspect-[4/3]',
  '1-1': 'aspect-square',
  auto: '',
}

const gapClasses: Record<ImageGalleryGap, string> = {
  small: 'gap-2',
  normal: 'gap-4',
  large: 'gap-6',
}

const gridColClasses: Record<string, string> = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

function GalleryItem({
  item,
  aspectRatio,
  sizes,
  priority = false,
}: {
  item: GalleryImage
  aspectRatio: ImageGalleryAspectRatio
  sizes: string
  priority?: boolean
}) {
  const imageData = typeof item.image === 'object' ? (item.image as Media) : null
  if (!imageData?.url) return null

  return (
    <div className="group relative overflow-hidden rounded-lg bg-grey-light">
      <div className={`relative ${aspectRatio !== 'auto' ? aspectClasses[aspectRatio] : 'min-h-[200px]'}`}>
        <Image
          src={imageData.url}
          alt={imageData.alt || item.caption || ''}
          fill={aspectRatio !== 'auto'}
          {...(aspectRatio === 'auto' ? { width: imageData.width || 800, height: imageData.height || 600 } : {})}
          className={`${aspectRatio !== 'auto' ? 'object-cover' : 'w-full h-auto'} transition-transform duration-300 group-hover:scale-105`}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-sm text-white">{item.caption}</p>
        </div>
      )}
    </div>
  )
}

export const ImageGalleryBlockComponent: React.FC<ImageGalleryBlockProps> = ({
  title,
  description,
  images,
  variant = 'grid',
  columns = '3',
  aspectRatio = '4-3',
  enableLightbox = true,
  gap = 'normal',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validImages = (images || []) as GalleryImage[]
  if (validImages.length === 0) return null

  const currentVariant = (variant || 'grid') as ImageGalleryVariant
  const currentAspect = (aspectRatio || '4-3') as ImageGalleryAspectRatio
  const currentGap = (gap || 'normal') as ImageGalleryGap

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="image-gallery-block bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        {(title || description) && (
          <div className="mb-8 text-center md:mb-12">
            {title && (
              <h2 className="font-display text-2xl text-navy md:text-3xl">{title}</h2>
            )}
            {description && (
              <p className="mt-3 text-sm text-grey-dark md:text-base">{description}</p>
            )}
          </div>
        )}

        {/* Grid Variant */}
        {currentVariant === 'grid' && (
          <div className={`grid ${gridColClasses[columns || '3']} ${gapClasses[currentGap]}`}>
            {validImages.map((img, index) => (
              <GalleryItem
                key={img.id || index}
                item={img}
                aspectRatio={currentAspect}
                sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${Math.round(100 / parseInt(columns || '3'))}vw`}
                priority={index < 3}
              />
            ))}
          </div>
        )}

        {/* Featured Grid Variant: first image large (2 cols, full height), rest fill right side */}
        {currentVariant === 'featured-grid' && (
          <div className={`grid grid-cols-1 md:grid-cols-3 ${gapClasses[currentGap]}`}>
            {/* Featured (first) image */}
            {validImages.length > 0 && (
              <div className="md:col-span-2 md:row-span-2">
                <div className="group relative h-full min-h-[300px] overflow-hidden rounded-lg bg-grey-light md:min-h-[400px]">
                  {(() => {
                    const imageData = typeof validImages[0].image === 'object' ? (validImages[0].image as Media) : null
                    if (!imageData?.url) return null
                    return (
                      <>
                        <Image
                          src={imageData.url}
                          alt={imageData.alt || validImages[0].caption || ''}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 66vw"
                          priority
                        />
                        {validImages[0].caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="text-sm text-white">{validImages[0].caption}</p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Remaining images in a column */}
            {validImages.slice(1).map((img, index) => (
              <GalleryItem
                key={img.id || index}
                item={img}
                aspectRatio={currentAspect}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ))}
          </div>
        )}

        {/* Masonry Variant */}
        {currentVariant === 'masonry' && (
          <div
            className="columns-1 md:columns-2 lg:columns-3"
            style={{ columnGap: currentGap === 'small' ? '8px' : currentGap === 'large' ? '24px' : '16px' }}
          >
            {validImages.map((img, index) => {
              const imageData = typeof img.image === 'object' ? (img.image as Media) : null
              if (!imageData?.url) return null

              return (
                <div key={img.id || index} className="mb-4 break-inside-avoid">
                  <div className="group relative overflow-hidden rounded-lg bg-grey-light">
                    <Image
                      src={imageData.url}
                      alt={imageData.alt || img.caption || ''}
                      width={imageData.width || 800}
                      height={imageData.height || 600}
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-sm text-white">{img.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ImageGalleryBlockComponent
