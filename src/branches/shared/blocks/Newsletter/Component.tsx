import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { FormRenderer } from '../_shared/FormRenderer'
import type { NewsletterBlockProps, NewsletterVariant, NewsletterBackgroundColor } from './types'

/**
 * B-28 Newsletter Block Component (Server)
 *
 * Newsletter signup section with 3 visual variants.
 * Delegates form rendering to the shared FormRenderer.
 *
 * Variants:
 * - inline: title left, form right on desktop
 * - card: centered card with shadow
 * - banner: full-width colored band
 */

function getBackgroundClasses(variant: NewsletterVariant, bg: NewsletterBackgroundColor): string {
  if (variant === 'banner') {
    switch (bg) {
      case 'navy':
        return 'bg-navy text-white'
      case 'teal':
        return 'bg-teal text-white'
      case 'grey':
        return 'bg-grey-lightest text-navy'
      default:
        return 'bg-grey-lightest text-navy'
    }
  }
  return 'bg-white text-navy'
}

function getCardClasses(bg: NewsletterBackgroundColor): string {
  switch (bg) {
    case 'navy':
      return 'bg-navy text-white'
    case 'teal':
      return 'bg-teal text-white'
    case 'grey':
      return 'bg-grey-lightest text-navy'
    default:
      return 'bg-grey-lightest text-navy'
  }
}

export const NewsletterBlockComponent: React.FC<NewsletterBlockProps> = ({
  title,
  description,
  form,
  variant = 'inline',
  backgroundColor = 'white',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'inline') as NewsletterVariant
  const currentBg = (backgroundColor || 'white') as NewsletterBackgroundColor

  if (!form || typeof form !== 'object') return null

  if (currentVariant === 'banner') {
    const bgClasses = getBackgroundClasses('banner', currentBg)

    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className={`newsletter-block py-10 md:py-14 ${bgClasses}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              {title && (
                <h2 className="font-display text-xl md:text-2xl mb-1">{title}</h2>
              )}
              {description && (
                <p className="text-sm opacity-90">{description}</p>
              )}
            </div>
            <div className="w-full md:w-auto md:min-w-[360px]">
              <FormRenderer form={form as FormType} />
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  if (currentVariant === 'card') {
    const cardClasses = getCardClasses(currentBg)

    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="newsletter-block py-12 md:py-16 lg:py-20 bg-white"
      >
        <div className="max-w-xl mx-auto px-6">
          <div className={`rounded-2xl p-8 md:p-10 text-center ${cardClasses}`}>
            {title && (
              <h2 className="font-display text-xl md:text-2xl mb-2">{title}</h2>
            )}
            {description && (
              <p className="text-sm mb-6 opacity-90">{description}</p>
            )}
            <FormRenderer form={form as FormType} />
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Default: inline variant
  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="newsletter-block py-12 md:py-16 lg:py-20 bg-grey-lightest"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-grey-dark">{description}</p>
            )}
          </div>
          <div className="w-full md:flex-1">
            <FormRenderer form={form as FormType} />
          </div>
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default NewsletterBlockComponent
