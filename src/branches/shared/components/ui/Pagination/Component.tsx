'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaginationButton } from './PaginationButton'
import type { PaginationProps, PageNumber } from './types'

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 24,
  maxVisiblePages = 7,
  variant = 'default',
  showArrows = true,
  showEllipsis = true,
  showCount = false,
  onPageChange,
  getPageUrl,
  className,
}: PaginationProps) {
  // Generate visible page numbers with smart ellipsis logic
  const getPageNumbers = (): PageNumber[] => {
    const pages: PageNumber[] = []

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Smart ellipsis logic
      if (currentPage <= 3) {
        // Near start: 1 2 3 ... 8
        pages.push(1, 2, 3)
        if (showEllipsis) pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... 6 7 8
        pages.push(1)
        if (showEllipsis) pages.push('...')
        pages.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        // Middle: 1 ... 4 5 6 ... 8
        pages.push(1)
        if (showEllipsis) pages.push('...')
        pages.push(currentPage - 1, currentPage, currentPage + 1)
        if (showEllipsis) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return

    onPageChange(page)

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Screen reader announcement
    if (totalItems && itemsPerPage) {
      const start = (page - 1) * itemsPerPage + 1
      const end = Math.min(page * itemsPerPage, totalItems)
      announceToScreenReader(
        `Pagina ${page} van ${totalPages} geladen. Toont resultaten ${start} tot ${end}.`,
      )
    } else {
      announceToScreenReader(`Pagina ${page} van ${totalPages} geladen.`)
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        e.preventDefault()
        handlePageChange(currentPage - 1)
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        e.preventDefault()
        handlePageChange(currentPage + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages])

  const pages = getPageNumbers()

  // Compact variant (mobile-friendly)
  if (variant === 'compact') {
    return (
      <nav
        aria-label="Paginanummering"
        role="navigation"
        className={cn('flex items-center justify-between pt-10', className)}
      >
        <PaginationButton
          page="prev"
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          href={getPageUrl ? getPageUrl(currentPage - 1) : undefined}
          aria-label="Vorige pagina"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Vorige
        </PaginationButton>

        <div className="text-[13px] font-semibold text-[var(--text)]">
          Pagina {currentPage} van {totalPages}
        </div>

        <PaginationButton
          page="next"
          isDisabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          href={getPageUrl ? getPageUrl(currentPage + 1) : undefined}
          aria-label="Volgende pagina"
        >
          Volgende
          <ChevronRight className="w-4 h-4 ml-2" />
        </PaginationButton>
      </nav>
    )
  }

  // Calculate result count for "with-count" variant
  const resultStart = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null
  const resultEnd =
    totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null

  return (
    <nav
      aria-label="Paginanummering"
      role="navigation"
      className={cn(
        'pt-10',
        {
          'flex items-center justify-center': variant === 'default',
          'flex items-center justify-between': variant === 'with-count',
        },
        className,
      )}
    >
      {/* Result count (only for with-count variant) */}
      {variant === 'with-count' && showCount && totalItems && (
        <div className="text-[14px] text-[var(--grey-mid)]">
          Resultaten{' '}
          <strong className="text-[var(--text)] font-bold">
            {resultStart}-{resultEnd}
          </strong>{' '}
          van <strong className="text-[var(--text)] font-bold">{totalItems}</strong>
        </div>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-[6px]">
        {/* Previous button */}
        {showArrows && (
          <PaginationButton
            page="prev"
            isDisabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            href={getPageUrl ? getPageUrl(currentPage - 1) : undefined}
            aria-label="Vorige pagina"
          >
            <ChevronLeft className="w-4 h-4" />
          </PaginationButton>
        )}

        {/* Page numbers */}
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="text-[14px] text-[var(--grey-mid)] px-1 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <PaginationButton
              key={page}
              page={page as number}
              isActive={page === currentPage}
              onClick={() => handlePageChange(page as number)}
              href={getPageUrl ? getPageUrl(page as number) : undefined}
              aria-label={
                page === currentPage
                  ? `Pagina ${page}, huidige pagina`
                  : `Ga naar pagina ${page}`
              }
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PaginationButton>
          ),
        )}

        {/* Next button */}
        {showArrows && (
          <PaginationButton
            page="next"
            isDisabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            href={getPageUrl ? getPageUrl(currentPage + 1) : undefined}
            aria-label="Volgende pagina"
          >
            <ChevronRight className="w-4 h-4" />
          </PaginationButton>
        )}
      </div>
    </nav>
  )
}

// Helper function to announce to screen readers
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
