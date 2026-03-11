import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { FAQBlockProps, FAQVariant, FAQItem } from './types'
import { FAQAccordion } from './FAQAccordion'

/**
 * B-05 FAQ Block Component (Server)
 *
 * Accordion-style FAQ section with expandable question/answer pairs.
 *
 * Variants:
 * - simple: minimal border-bottom between items
 * - bordered: card-style border around each item
 * - colored: alternating background colors per item
 */
export const FAQBlockComponent: React.FC<FAQBlockProps> = ({
  title,
  subtitle,
  items,
  variant = 'simple',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'simple') as FAQVariant

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="faq-block py-12 md:py-16 lg:py-20 bg-white"
    >
      <div className="max-w-3xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="mb-8 md:mb-12 text-center">
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
            )}
            {subtitle && <p className="text-sm md:text-base text-grey-dark">{subtitle}</p>}
          </div>
        )}

        <FAQAccordion items={(items as FAQItem[]) || []} variant={currentVariant} />
      </div>
    </AnimationWrapper>
  )
}

export default FAQBlockComponent
