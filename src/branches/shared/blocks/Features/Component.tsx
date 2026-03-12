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
 * Layouts: grid-3, grid-4, list, split
 * Backgrounds: white (default), light (grey-50), navy (dark)
 */

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-gray-50',
  navy: 'bg-gradient-to-br from-slate-800 to-slate-950 text-white',
}

export const FeaturesBlockComponent: React.FC<FeaturesBlockProps> = ({
  title,
  subtitle,
  description,
  features,
  layout = 'grid-3',
  iconStyle = 'glow',
  backgroundStyle = 'white',
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
  const currentBg = (backgroundStyle || 'white') as string
  const isDark = currentBg === 'navy'

  const resolvedSplitImage =
    typeof splitImage === 'object' && splitImage !== null ? (splitImage as Media) : null

  // Displayed subtitle — use description as fallback
  const displaySubtitle = subtitle || (typeof description === 'string' ? description : null)

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
        {(title || displaySubtitle) && (
          <div className="mb-6 md:mb-8">
            {title && (
              <h2 className={`font-display text-2xl md:text-3xl mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
                {title}
              </h2>
            )}
            {displaySubtitle && (
              <p className={`text-sm md:text-base ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                {displaySubtitle}
              </p>
            )}
          </div>
        )}
        <FeaturesGrid
          features={(features as FeatureItem[]) || []}
          layout="list"
          iconStyle={currentIconStyle}
          backgroundStyle={currentBg as any}
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
        className={`features-block py-12 md:py-16 lg:py-20 ${bgClasses[currentBg] || bgClasses.white}`}
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
      className={`features-block py-12 md:py-16 lg:py-20 ${bgClasses[currentBg] || bgClasses.white}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        {(title || displaySubtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            {title && (
              <h2 className={`font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
                {title}
              </h2>
            )}
            {displaySubtitle && (
              <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                {displaySubtitle}
              </p>
            )}
          </div>
        )}

        {/* Feature cards grid */}
        <FeaturesGrid
          features={(features as FeatureItem[]) || []}
          layout={currentLayout}
          iconStyle={currentIconStyle}
          backgroundStyle={currentBg as any}
        />
      </div>
    </AnimationWrapper>
  )
}

export default FeaturesBlockComponent
