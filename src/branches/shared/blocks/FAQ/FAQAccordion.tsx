'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { serializeLexical } from '@/utilities/serializeLexical'

/**
 * B-05 FAQ Accordion (Client Component)
 *
 * Handles smooth open/close transitions with height animation.
 * Only one item open at a time.
 */

interface FAQItem {
  question: string
  answer: any // Lexical JSON
  id?: string | null
}

type FAQVariant = 'simple' | 'bordered' | 'colored'

interface FAQAccordionProps {
  items: FAQItem[]
  variant: FAQVariant
}

interface AccordionItemProps {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: (index: number) => void
  variant: FAQVariant
}

function AccordionItem({ item, index, isOpen, onToggle, variant }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  const variantClasses: Record<FAQVariant, { wrapper: string; summary: string }> = {
    simple: {
      wrapper: 'border-b border-grey-light',
      summary: '',
    },
    bordered: {
      wrapper: 'border border-grey-light rounded-lg',
      summary: 'px-4',
    },
    colored: {
      wrapper: `rounded-lg ${index % 2 === 0 ? 'bg-grey-lightest' : 'bg-white'}`,
      summary: 'px-4',
    },
  }

  const classes = variantClasses[variant]

  return (
    <div className={classes.wrapper}>
      <button
        onClick={() => onToggle(index)}
        className={`flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-teal ${classes.summary}`}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${index}`}
      >
        <span className="text-sm md:text-base font-semibold text-navy">{item.question}</span>
        <div
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
            isOpen ? 'bg-teal rotate-45' : 'bg-grey-light'
          }`}
        >
          <svg
            className={`h-3.5 w-3.5 transition-colors ${isOpen ? 'text-white' : 'text-grey-mid'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      <div
        id={`faq-content-${index}`}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: `${height}px` }}
        role="region"
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className={`pb-4 text-sm leading-relaxed text-grey-dark ${classes.summary}`}>
          {serializeLexical({ nodes: item.answer })}
        </div>
      </div>
    </div>
  )
}

export function FAQAccordion({ items, variant }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  const wrapperClasses: Record<FAQVariant, string> = {
    simple: 'space-y-0',
    bordered: 'space-y-3',
    colored: 'space-y-2',
  }

  return (
    <div className={wrapperClasses[variant]}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id || index}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={handleToggle}
          variant={variant}
        />
      ))}
    </div>
  )
}
