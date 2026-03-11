import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { AccordionBlockProps, AccordionVariant, AccordionItem } from './types'
import { AccordionClient } from './AccordionClient'

/**
 * B-08 Accordion Block Component (Server)
 *
 * Generic accordion with rich text content per item.
 *
 * Variants:
 * - simple: divider lines between items
 * - bordered: border around each item
 * - separated: gap between items with card styling
 */
export const AccordionBlockComponent: React.FC<AccordionBlockProps> = ({
  title,
  items,
  variant = 'simple',
  allowMultiple = false,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'simple') as AccordionVariant

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="accordion-block py-12 md:py-16 lg:py-20 bg-white"
    >
      <div className="max-w-3xl mx-auto px-6">
        {title && (
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-8 md:mb-10 text-center">
            {title}
          </h2>
        )}

        <AccordionClient
          items={(items as AccordionItem[]) || []}
          variant={currentVariant}
          allowMultiple={allowMultiple ?? false}
        />
      </div>
    </AnimationWrapper>
  )
}

export default AccordionBlockComponent
