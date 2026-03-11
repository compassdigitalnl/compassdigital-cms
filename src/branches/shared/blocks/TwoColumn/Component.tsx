import React from 'react'
import Image from 'next/image'
import { serializeLexical } from '@/utilities/serializeLexical'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { TwoColumnBlockProps, TwoColumnVariant, TwoColumnGap } from './types'
import type { Media } from '@/payload-types'

/**
 * B-02 Two Column Block Component
 *
 * Responsive two-column grid layout.
 * Stacks vertically on mobile, side-by-side from md breakpoint.
 *
 * Variants:
 * - text-text: both columns are rich text
 * - text-image / image-text: one column is an image, position switchable
 */

const gapClasses: Record<TwoColumnGap, string> = {
  sm: 'gap-4 md:gap-4',
  md: 'gap-6 md:gap-8',
  lg: 'gap-8 md:gap-12',
}

export const TwoColumnBlockComponent: React.FC<TwoColumnBlockProps> = ({
  leftColumn,
  rightColumn,
  image,
  imagePosition = 'right',
  variant = 'text-text',
  gap = 'md',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'text-text') as TwoColumnVariant
  const currentGap = (gap || 'md') as TwoColumnGap
  const resolvedImage = typeof image === 'object' && image !== null ? (image as Media) : null

  const isImageVariant = currentVariant === 'text-image' || currentVariant === 'image-text'
  const imageOnLeft =
    currentVariant === 'image-text' || (isImageVariant && imagePosition === 'left')

  const renderTextColumn = (content: typeof leftColumn, key: string) => (
    <div key={key} className="prose prose-sm md:prose-base max-w-none text-navy">
      {content ? serializeLexical({ nodes: content }) : null}
    </div>
  )

  const renderImageColumn = () => (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-grey-light">
      {resolvedImage?.url ? (
        <Image
          src={resolvedImage.url}
          alt={resolvedImage.alt || ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-grey-dark text-sm">
          Geen afbeelding geselecteerd
        </div>
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
      className="two-column-block py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gapClasses[currentGap]} items-start`}>
          {currentVariant === 'text-text' ? (
            <>
              {renderTextColumn(leftColumn, 'left')}
              {renderTextColumn(rightColumn, 'right')}
            </>
          ) : imageOnLeft ? (
            <>
              {renderImageColumn()}
              {renderTextColumn(leftColumn, 'text')}
            </>
          ) : (
            <>
              {renderTextColumn(leftColumn, 'text')}
              {renderImageColumn()}
            </>
          )}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default TwoColumnBlockComponent
