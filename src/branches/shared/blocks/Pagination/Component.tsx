import React from 'react'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { PaginationBlockProps, PaginationVariant } from './types'

/**
 * B-36 Pagination Block Component (Server)
 *
 * Page navigation. Numbered: 1 2 3 ... 10. Simple: Vorige/Volgende only.
 * Ellipsis for large page counts. First/last buttons optional.
 */

function buildPageUrl(baseUrl: string, page: number): string {
  if (page === 1) return baseUrl
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}page=${page}`
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  // Always show first page
  pages.push(1)

  if (currentPage > 3) {
    pages.push('ellipsis')
  }

  // Show pages around current
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis')
  }

  // Always show last page
  pages.push(totalPages)

  return pages
}

const buttonBase = 'inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150'
const buttonActive = 'border-teal bg-teal text-white'
const buttonDefault = 'border-grey bg-white text-navy hover:border-teal hover:text-teal'
const buttonDisabled = 'pointer-events-none border-grey bg-grey-light text-grey-mid'

export const PaginationBlockComponent: React.FC<PaginationBlockProps> = ({
  totalPages,
  currentPage = 1,
  baseUrl,
  variant = 'numbered',
  showFirstLast = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!totalPages || totalPages < 2 || !baseUrl) return null

  const current = currentPage || 1
  const currentVariant = (variant || 'numbered') as PaginationVariant
  const hasPrev = current > 1
  const hasNext = current < totalPages

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="nav"
      className="pagination-block px-6 py-6"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
        {/* Simple variant */}
        {currentVariant === 'simple' && (
          <>
            {hasPrev ? (
              <Link
                href={buildPageUrl(baseUrl, current - 1)}
                className={`${buttonBase} ${buttonDefault} px-4`}
              >
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Vorige
              </Link>
            ) : (
              <span className={`${buttonBase} ${buttonDisabled} px-4`}>
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Vorige
              </span>
            )}

            <span className="px-3 text-sm text-grey-mid">
              Pagina {current} van {totalPages}
            </span>

            {hasNext ? (
              <Link
                href={buildPageUrl(baseUrl, current + 1)}
                className={`${buttonBase} ${buttonDefault} px-4`}
              >
                Volgende
                <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className={`${buttonBase} ${buttonDisabled} px-4`}>
                Volgende
                <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </>
        )}

        {/* Numbered variant */}
        {currentVariant === 'numbered' && (
          <>
            {/* First page button */}
            {showFirstLast && current > 2 && (
              <Link
                href={buildPageUrl(baseUrl, 1)}
                className={`${buttonBase} ${buttonDefault} px-2`}
                aria-label="Eerste pagina"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </Link>
            )}

            {/* Previous button */}
            {hasPrev ? (
              <Link
                href={buildPageUrl(baseUrl, current - 1)}
                className={`${buttonBase} ${buttonDefault} px-2`}
                aria-label="Vorige pagina"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            ) : (
              <span className={`${buttonBase} ${buttonDisabled} px-2`} aria-disabled="true">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            )}

            {/* Page numbers */}
            {getPageNumbers(current, totalPages).map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className="px-1 text-grey-mid">
                    &hellip;
                  </span>
                )
              }

              if (page === current) {
                return (
                  <span
                    key={page}
                    className={`${buttonBase} ${buttonActive} px-1`}
                    aria-current="page"
                  >
                    {page}
                  </span>
                )
              }

              return (
                <Link
                  key={page}
                  href={buildPageUrl(baseUrl, page)}
                  className={`${buttonBase} ${buttonDefault} px-1`}
                >
                  {page}
                </Link>
              )
            })}

            {/* Next button */}
            {hasNext ? (
              <Link
                href={buildPageUrl(baseUrl, current + 1)}
                className={`${buttonBase} ${buttonDefault} px-2`}
                aria-label="Volgende pagina"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className={`${buttonBase} ${buttonDisabled} px-2`} aria-disabled="true">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}

            {/* Last page button */}
            {showFirstLast && current < totalPages - 1 && (
              <Link
                href={buildPageUrl(baseUrl, totalPages)}
                className={`${buttonBase} ${buttonDefault} px-2`}
                aria-label="Laatste pagina"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default PaginationBlockComponent
