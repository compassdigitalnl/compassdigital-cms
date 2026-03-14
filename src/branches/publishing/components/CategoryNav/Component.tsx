'use client'

import React, { useRef, useCallback } from 'react'
import type { CategoryNavProps } from './types'

/**
 * CategoryNav — Horizontal category navigation with pill buttons
 *
 * Client component with horizontal scrolling on mobile and wrapping on desktop.
 * Active state uses the primary color.
 *
 * @example
 * ```tsx
 * <CategoryNav
 *   categories={categories}
 *   activeCategory={activeSlug}
 *   onCategoryChange={(slug) => setActiveSlug(slug)}
 *   showAll
 * />
 * ```
 */
export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  showAll = true,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (slug: string | null) => {
      onCategoryChange(slug)
    },
    [onCategoryChange],
  )

  const isAllActive = activeCategory === null

  return (
    <div className={`relative ${className}`}>
      {/* Scrollable container on mobile, wrapping on desktop */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* "Alle" button */}
        {showAll && (
          <button
            type="button"
            onClick={() => handleClick(null)}
            className={`
              flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2
              text-sm font-medium transition-all duration-200
              ${
                isAllActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)] hover:text-[var(--color-base-900)]'
              }
            `}
          >
            Alle
          </button>
        )}

        {/* Category pills */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleClick(category.slug)}
              className={`
                flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)] hover:text-[var(--color-base-900)]'
                }
              `}
            >
              {category.title}
              {typeof category.count === 'number' && (
                <span
                  className={`ml-1.5 text-xs ${
                    isActive
                      ? 'text-white/80'
                      : 'text-[var(--color-base-500)]'
                  }`}
                >
                  ({category.count})
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryNav
