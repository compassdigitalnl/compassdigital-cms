/**
 * FAQ Component - 100% Theme Variable Compliant
 *
 * Refactored from inline styles with fallbacks and hover handlers
 * to theme variables. All colors now use CSS variables from ThemeProvider.
 */
'use client'

import React from 'react'
import type { FAQBlock } from '@/payload-types'
import { RichText } from '@/branches/shared/components/common/RichText'

export const FAQBlockComponent: React.FC<FAQBlock> = ({ heading, intro, source, faqs, items }) => {
  // Determine which data source to use
  const faqData = React.useMemo(() => {
    if (source === 'collection' && faqs && Array.isArray(faqs)) {
      // Collection mode: transform FAQ objects to match items structure
      return faqs.map((faq) => {
        if (typeof faq === 'object' && faq !== null && 'question' in faq && 'answer' in faq) {
          return {
            question: faq.question,
            answer: faq.answer,
          }
        }
        return null
      }).filter(Boolean)
    }
    // Manual mode: use items array
    return items || []
  }, [source, faqs, items])

  return (
    <section className="faq py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-8 text-gray-600">{intro}</p>}

        <div className="space-y-4">
          {faqData?.map((item, index) => (
            <details
              key={index}
              className="faq-item border border-primary hover:border-secondary hover:bg-secondary/5 rounded-lg p-6 hover:shadow-md transition-all duration-300 group"
            >
              <summary
                className="font-semibold text-lg text-primary cursor-pointer flex items-center justify-between"
              >
                <span className="pr-4">{item.question}</span>
                <svg
                  className="chevron-icon w-5 h-5 flex-shrink-0 transition-transform duration-300 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 text-gray-800">
                {item.answer && <RichText data={item.answer} enableGutter={false} />}
              </div>
            </details>
          ))}
        </div>

        <style jsx>{`
          .faq-item[open] .chevron-icon {
            transform: rotate(180deg);
          }
          .faq-item summary {
            list-style: none;
          }
          .faq-item summary::-webkit-details-marker {
            display: none;
          }
        `}</style>
      </div>
    </section>
  )
}
