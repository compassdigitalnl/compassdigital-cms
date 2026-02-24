import React from 'react'
import type { FAQBlock } from '@/payload-types'
import { FAQAccordion } from './FAQAccordion'

/**
 * B04 - FAQ Block Component (Server)
 *
 * Accordion-style FAQ section with expandable answers.
 *
 * FEATURES:
 * - Server component wrapper
 * - Client component for accordion state
 * - Plus icon rotates to X on open
 * - Only one FAQ open at a time
 * - Rich text answers with Lexical
 *
 * @see docs/refactoring/sprint-9/shared/b04-faq.html
 */

export const FAQBlockComponent: React.FC<FAQBlock> = ({
  title,
  description,
  faqs,
  variant = 'single-column',
}) => {
  return (
    <section className="faq-block py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h2 className="font-display text-3xl text-navy md:text-4xl mb-3">{title}</h2>
            )}
            {description && <p className="text-base text-grey-mid">{description}</p>}
          </div>
        )}

        <FAQAccordion faqs={faqs || []} variant={variant} />
      </div>
    </section>
  )
}

export default FAQBlockComponent
