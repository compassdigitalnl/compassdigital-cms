import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type {
  TwoColumnImagePairBlockProps,
  ImagePairLayout,
  ImagePairType,
  ImagePairAspectRatio,
  ImagePairSpacing,
} from './types'
import type { Media } from '@/payload-types'

/**
 * B-02d Two Column Image Pair Block Component
 *
 * Displays two images side-by-side with flexible layout options
 * and optional text overlays or comparison badges.
 *
 * Stacks vertically on mobile, side-by-side from md breakpoint.
 */

const layoutClasses: Record<ImagePairLayout, string> = {
  equal: 'grid-cols-1 md:grid-cols-2',
  'left-large': 'grid-cols-1 md:grid-cols-[3fr_2fr]',
  'right-large': 'grid-cols-1 md:grid-cols-[2fr_3fr]',
  comparison: 'grid-cols-1 md:grid-cols-2',
}

const spacingClasses: Record<ImagePairSpacing, string> = {
  compact: 'gap-4',
  default: 'gap-8',
  spacious: 'gap-12',
}

const aspectRatioClasses: Record<ImagePairAspectRatio, string> = {
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
}

export const TwoColumnImagePairBlockComponent: React.FC<TwoColumnImagePairBlockProps> = ({
  image1,
  caption1,
  overlay1,
  comparisonBadge1,
  image2,
  caption2,
  overlay2,
  comparisonBadge2,
  layout = 'equal',
  imageType = 'standard',
  aspectRatio = 'landscape',
  spacing = 'default',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentLayout = (layout || 'equal') as ImagePairLayout
  const currentType = (imageType || 'standard') as ImagePairType
  const currentAspectRatio = (aspectRatio || 'landscape') as ImagePairAspectRatio
  const currentSpacing = (spacing || 'default') as ImagePairSpacing

  const resolvedImage1 = typeof image1 === 'object' && image1 !== null ? (image1 as Media) : null
  const resolvedImage2 = typeof image2 === 'object' && image2 !== null ? (image2 as Media) : null

  const renderImage = (
    image: Media | null,
    caption: string | null | undefined,
    overlay: { title?: string | null; description?: string | null } | null | undefined,
    comparisonBadge: string | null | undefined,
    index: number,
  ) => (
    <div key={index}>
      <div
        className={`relative rounded-2xl overflow-hidden shadow-md group ${aspectRatioClasses[currentAspectRatio]} bg-grey-light`}
      >
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-grey-dark text-sm">
            Geen afbeelding geselecteerd
          </div>
        )}

        {/* Standard type: hover caption */}
        {currentType === 'standard' && caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-navy/80 text-white opacity-0 group-hover:opacity-100 transition-opacity px-4 py-3 text-sm">
            {caption}
          </div>
        )}

        {/* Overlay type: card overlay */}
        {currentType === 'overlay' && overlay?.title && (
          <div className="absolute top-4 left-4 bg-white/90 rounded-xl p-4 shadow-md max-w-[200px]">
            <p className="font-semibold text-sm text-navy">{overlay.title}</p>
            {overlay.description && (
              <p className="text-xs text-grey-dark mt-1">{overlay.description}</p>
            )}
          </div>
        )}

        {/* Comparison type: badge */}
        {currentLayout === 'comparison' && comparisonBadge && (
          <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
            {comparisonBadge}
          </span>
        )}
      </div>

      {/* Comparison type: label below image */}
      {currentLayout === 'comparison' && comparisonBadge && (
        <p className="text-center mt-3 font-semibold text-navy">{comparisonBadge}</p>
      )}
    </div>
  )

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="two-column-image-pair-block py-12 md:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid ${layoutClasses[currentLayout]} ${spacingClasses[currentSpacing]} items-start`}
        >
          {renderImage(resolvedImage1, caption1, overlay1, comparisonBadge1, 0)}
          {renderImage(resolvedImage2, caption2, overlay2, comparisonBadge2, 1)}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default TwoColumnImagePairBlockComponent
