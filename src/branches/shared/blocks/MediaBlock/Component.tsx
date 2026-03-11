import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { MediaBlockProps, MediaBlockSize } from './types'
import type { Media } from '@/payload-types'

/**
 * B-06 Media Block Component (Server)
 *
 * Single image display with optional caption.
 *
 * Size options:
 * - narrow: max-w-2xl centered
 * - wide: max-w-5xl centered
 * - full: w-full edge-to-edge
 */

const sizeClasses: Record<MediaBlockSize, string> = {
  narrow: 'max-w-2xl',
  wide: 'max-w-5xl',
  full: 'w-full',
}

export const MediaBlockComponent: React.FC<MediaBlockProps> = ({
  image,
  caption,
  alt,
  size = 'wide',
  rounded = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!image || typeof image === 'number') return null

  const media = image as Media
  const imageUrl = media.url
  const imageAlt = alt || media.alt || ''
  const imageWidth = media.width || 1200
  const imageHeight = media.height || 800
  const currentSize = (size || 'wide') as MediaBlockSize

  if (!imageUrl) return null

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="media-block py-12 md:py-16 bg-white"
    >
      <div className={`mx-auto px-6 ${sizeClasses[currentSize]}`}>
        <figure>
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className={`w-full h-auto object-cover ${rounded ? 'rounded-lg md:rounded-xl' : ''}`}
            sizes={
              currentSize === 'narrow'
                ? '(max-width: 672px) 100vw, 672px'
                : currentSize === 'wide'
                  ? '(max-width: 1024px) 100vw, 1024px'
                  : '100vw'
            }
          />
          {caption && (
            <figcaption className="mt-3 text-center text-sm text-grey-mid">{caption}</figcaption>
          )}
        </figure>
      </div>
    </AnimationWrapper>
  )
}

export default MediaBlockComponent
