'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { serializeLexical } from '@/utilities/serializeLexical'

/**
 * B-08 Accordion Client Component
 *
 * Handles smooth open/close transitions with height animation.
 * Supports single-open and multi-open modes.
 * Rich text content via serializeLexical.
 */

interface AccordionItem {
  title: string
  content: any // Lexical JSON
  defaultOpen?: boolean | null
  id?: string | null
}

type AccordionVariant = 'simple' | 'bordered' | 'separated'

interface AccordionClientProps {
  items: AccordionItem[]
  variant: AccordionVariant
  allowMultiple: boolean
}

interface AccordionItemComponentProps {
  item: AccordionItem
  index: number
  isOpen: boolean
  onToggle: (index: number) => void
  variant: AccordionVariant
}

function AccordionItemComponent({
  item,
  index,
  isOpen,
  onToggle,
  variant,
}: AccordionItemComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  const variantClasses: Record<AccordionVariant, { wrapper: string; header: string }> = {
    simple: {
      wrapper: 'border-b border-grey-light',
      header: '',
    },
    bordered: {
      wrapper: 'border border-grey-light rounded-lg',
      header: 'px-5',
    },
    separated: {
      wrapper: 'bg-grey-lightest rounded-lg shadow-sm',
      header: 'px-5',
    },
  }

  const classes = variantClasses[variant]

  return (
    <div className={classes.wrapper}>
      <button
        onClick={() => onToggle(index)}
        className={`flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-teal ${classes.header}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <span className="text-sm md:text-base font-semibold text-navy">{item.title}</span>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-grey-mid transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={`accordion-content-${index}`}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: `${height}px` }}
        role="region"
        aria-hidden={!isOpen}
      >
        <div
          ref={contentRef}
          className={`pb-4 text-sm leading-relaxed text-grey-dark prose prose-sm max-w-none prose-a:text-teal ${classes.header}`}
        >
          {serializeLexical({ nodes: item.content })}
        </div>
      </div>
    </div>
  )
}

export function AccordionClient({ items, variant, allowMultiple }: AccordionClientProps) {
  // Calculate initial open indices from defaultOpen flags
  const initialOpenIndices = useMemo(() => {
    const indices = new Set<number>()
    items.forEach((item, index) => {
      if (item.defaultOpen) {
        indices.add(index)
      }
    })
    return indices
  }, [items])

  const [openIndices, setOpenIndices] = useState<Set<number>>(initialOpenIndices)

  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(prev)
        if (next.has(index)) {
          next.delete(index)
        } else {
          if (!allowMultiple) {
            next.clear()
          }
          next.add(index)
        }
        return next
      })
    },
    [allowMultiple],
  )

  const wrapperClasses: Record<AccordionVariant, string> = {
    simple: 'space-y-0',
    bordered: 'space-y-3',
    separated: 'space-y-3',
  }

  return (
    <div className={wrapperClasses[variant]}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id || index}
          item={item}
          index={index}
          isOpen={openIndices.has(index)}
          onToggle={handleToggle}
          variant={variant}
        />
      ))}
    </div>
  )
}
