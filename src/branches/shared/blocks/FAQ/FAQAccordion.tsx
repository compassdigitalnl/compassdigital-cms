'use client'

import React, { useState } from 'react'
import { serializeLexical } from '@/utilities/serializeLexical'

/**
 * B04 - FAQ Accordion Component (Client)
 *
 * Client component for accordion state management.
 *
 * FEATURES:
 * - Plus icon rotates 45° to form X when open
 * - Only one FAQ open at a time
 * - Background changes from grey-light to teal
 * - Two-column layout support
 *
 * @see docs/refactoring/sprint-9/shared/b04-faq.html
 */

interface FAQItem {
  question: string
  answer: any // Lexical JSON
}

interface FAQAccordionProps {
  faqs: FAQItem[]
  variant: 'single-column' | 'two-column'
}

export function FAQAccordion({ faqs, variant }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const columns = variant === 'two-column' ? 2 : 1
  const itemsPerColumn = Math.ceil(faqs.length / columns)

  const columnArrays: FAQItem[][] = []
  for (let i = 0; i < columns; i++) {
    columnArrays.push(faqs.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
  }

  return (
    <div
      className={`grid gap-6 ${variant === 'two-column' ? 'md:grid-cols-2' : 'grid-cols-1'}`}
    >
      {columnArrays.map((columnFaqs, colIndex) => (
        <div key={colIndex} className="space-y-3">
          {columnFaqs.map((faq, itemIndex) => {
            const globalIndex = colIndex * itemsPerColumn + itemIndex
            const isOpen = openIndex === globalIndex

            return (
              <div key={globalIndex} className="border-b border-grey">
                {/* Question button */}
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-teal"
                >
                  <span className="text-sm font-bold text-navy">{faq.question}</span>
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                      isOpen ? 'bg-teal rotate-45' : 'bg-grey-light'
                    }`}
                  >
                    <svg
                      className={`h-3.5 w-3.5 transition-colors ${
                        isOpen ? 'text-white' : 'text-grey-mid'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer content */}
                {isOpen && (
                  <div className="pb-4 text-sm leading-relaxed text-grey-dark">
                    {serializeLexical({ nodes: faq.answer })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
