import React from 'react'
import Image from 'next/image'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { FeaturesBlockProps, FeaturesLayout, FeaturesIconStyle, FeatureItem } from './types'
import type { Media } from '@/payload-types'
import { FeaturesGrid } from './Component.client'

/**
 * B-03 Features Block Component (Server)
 *
 * Features/USPs grid with Lucide icons and flexible layouts.
 * The icon rendering is delegated to a client component for dynamic Lucide imports.
 *
 * Layouts:
 * - grid-3: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - grid-4: 1 col mobile, 2 cols tablet, 4 cols desktop
 * - list: single column with horizontal layout per item
 * - split: image + feature items side by side
 */

export const FeaturesBlockComponent: React.FC<FeaturesBlockProps> = ({
  title,
  subtitle,
  features,
  layout = 'grid-3',
  iconStyle = 'glow',
  splitImage,
  splitImagePosition = 'left',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentLayout = (layout || 'grid-3') as FeaturesLayout
  const currentIconStyle = (iconStyle || 'glow') as FeaturesIconStyle
  const currentSplitPosition = (splitImagePosition || 'left') as 'left' | 'right'

  const resolvedSplitImage =
    typeof splitImage === 'object' && splitImage !== null ? (splitImage as Media) : null

  // Split layout rendering
  if (currentLayout === 'split') {
    const imageColumn = resolvedSplitImage?.url ? (
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-2xl overflow-hidden">
        <Image
          src={resolvedSplitImage.url}
          alt={resolvedSplitImage.alt || title || ''}
          fill
          className="object-cover"
        />
      </div>
    ) : (
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-2xl bg-grey-light" />
    )

    const contentColumn = (
      <div className="flex flex-col justify-center">
        {/* Section header */}
        {(title || subtitle) && (
          <div className="mb-6 md:mb-8">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-grey-dark">{subtitle}</p>
            )}
          </div>
        )}

        {/* Feature items in list mode */}
        <FeaturesGrid
          features={(features as FeatureItem[]) || []}
          layout="list"
          iconStyle={currentIconStyle}
        />
      </div>
    )

    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="features-block py-12 md:py-16 lg:py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {currentSplitPosition === 'left' ? (
              <>
                {imageColumn}
                {contentColumn}
              </>
            ) : (
              <>
                {contentColumn}
                {imageColumn}
              </>
            )}
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Default grid/list layout rendering
  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="features-block py-12 md:py-16 lg:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-grey-dark">{subtitle}</p>
            )}
          </div>
        )}

        {/* Feature cards grid (client component for dynamic icons) */}
        <FeaturesGrid
          features={(features as FeatureItem[]) || []}
          layout={currentLayout}
          iconStyle={currentIconStyle}
        />
      </div>
    </AnimationWrapper>
  )
}

export default FeaturesBlockComponent
