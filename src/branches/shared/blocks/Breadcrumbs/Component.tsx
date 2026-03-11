import React from 'react'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { BreadcrumbsBlockProps, BreadcrumbSeparator, BreadcrumbItem } from './types'

/**
 * B-35 Breadcrumbs Block Component (Server)
 *
 * Breadcrumb navigation with Home, separator options, and Schema.org markup.
 * Last item is not linked (current page).
 */

const separatorMap: Record<BreadcrumbSeparator, React.ReactNode> = {
  slash: <span className="mx-2 text-grey-mid">/</span>,
  chevron: (
    <svg className="mx-2 h-3.5 w-3.5 text-grey-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  dot: <span className="mx-2 text-grey-mid">&middot;</span>,
}

export const BreadcrumbsBlockComponent: React.FC<BreadcrumbsBlockProps> = ({
  items,
  showHome = true,
  separator = 'chevron',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const breadcrumbItems: BreadcrumbItem[] = []

  // Prepend Home link
  if (showHome) {
    breadcrumbItems.push({ label: 'Home', link: '/' })
  }

  // Add user-defined items
  if (items && Array.isArray(items)) {
    breadcrumbItems.push(...(items as BreadcrumbItem[]))
  }

  if (breadcrumbItems.length === 0) return null

  const currentSeparator = (separator || 'chevron') as BreadcrumbSeparator
  const sep = separatorMap[currentSeparator]

  // Build Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.link && index < breadcrumbItems.length - 1 ? { item: item.link } : {}),
    })),
  }

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="nav"
      className="breadcrumbs-block px-6 py-3"
    >
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mx-auto max-w-6xl">
        <ol className="flex flex-wrap items-center text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1

            return (
              <li key={item.id || index} className="flex items-center">
                {/* Separator (not before first item) */}
                {index > 0 && sep}

                {/* Link or plain text */}
                {isLast || !item.link ? (
                  <span className={`${isLast ? 'font-medium text-navy' : 'text-grey-mid'}`}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.link}
                    className="text-grey-mid transition-colors hover:text-teal"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </AnimationWrapper>
  )
}

export default BreadcrumbsBlockComponent
