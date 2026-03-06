'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PricingFAQProps } from './types'

export const PricingFAQ: React.FC<PricingFAQProps> = ({
  title = 'Veelgestelde vragen',
  items,
  className = '',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={`mx-auto max-w-[740px] ${className}`}>
      <h2 className="mb-5 text-center font-heading text-[26px] font-extrabold text-[var(--color-text-primary)]">
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className="overflow-hidden rounded-[14px] border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-5 py-4 text-left text-[15px] font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-grey-light,#F1F4F8)]"
              >
                {item.question}
                <ChevronDown
                  className={`h-[18px] w-[18px] flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
