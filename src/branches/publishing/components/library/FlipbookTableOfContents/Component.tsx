'use client'

import React, { useMemo } from 'react'
import { X, List, Grid3X3 } from 'lucide-react'
import type { FlipbookTableOfContentsProps } from './types'

export const FlipbookTableOfContents: React.FC<FlipbookTableOfContentsProps> = ({
  entries,
  onGoToPage,
  currentPage,
  isOpen,
  onClose,
  totalPages = 0,
}) => {
  const hasTOC = entries.length > 0

  // Generate page thumbnail grid when no TOC is available
  const pageThumbnails = useMemo(() => {
    if (hasTOC || totalPages <= 0) return []
    return Array.from({ length: totalPages }, (_, i) => i)
  }, [hasTOC, totalPages])

  // Find the active TOC entry
  const activeEntryIndex = useMemo(() => {
    if (!hasTOC) return -1
    // Find the last entry whose page number is <= current page
    let active = -1
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].pageNumber <= currentPage + 1) {
        active = i
      }
    }
    return active
  }, [entries, currentPage, hasTOC])

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-white
          shadow-[4px_0_16px_rgba(0,0,0,0.08)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ borderColor: 'var(--color-base-200, #e2e8f0)' }}
        role="dialog"
        aria-label="Inhoudsopgave"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-base-200,#e2e8f0)] px-4 py-3">
          <h2 className="flex items-center gap-2 font-heading text-[14px] font-extrabold text-[var(--color-base-900,#0f172a)]">
            {hasTOC ? (
              <>
                <List className="h-4 w-4 text-[var(--color-primary,#7c3aed)]" />
                Inhoudsopgave
              </>
            ) : (
              <>
                <Grid3X3 className="h-4 w-4 text-[var(--color-primary,#7c3aed)]" />
                Pagina-overzicht
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-base-400,#94a3b8)] transition-colors hover:bg-[var(--color-base-100,#f1f5f9)] hover:text-[var(--color-base-700,#334155)]"
            aria-label="Sluiten"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {hasTOC ? (
            /* TOC entries list */
            <nav className="py-2">
              {entries.map((entry, index) => {
                const isActive = index === activeEntryIndex
                return (
                  <button
                    key={`${entry.pageNumber}-${index}`}
                    onClick={() => {
                      onGoToPage(entry.pageNumber - 1) // Convert to 0-based
                      onClose()
                    }}
                    className={`
                      flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors
                      hover:bg-[var(--color-base-50,#f8fafc)]
                      ${isActive ? 'bg-[var(--color-base-50,#f8fafc)]' : ''}
                    `}
                  >
                    {/* Page number indicator */}
                    <span
                      className={`
                        flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold
                        ${isActive
                          ? 'text-white'
                          : 'bg-[var(--color-base-100,#f1f5f9)] text-[var(--color-base-500,#64748b)]'
                        }
                      `}
                      style={isActive ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : undefined}
                    >
                      {entry.pageNumber}
                    </span>

                    {/* Entry title */}
                    <span
                      className={`
                        flex-1 text-[13px] leading-snug
                        ${isActive
                          ? 'font-bold text-[var(--color-base-900,#0f172a)]'
                          : 'text-[var(--color-base-600,#475569)]'
                        }
                      `}
                    >
                      {entry.title}
                    </span>
                  </button>
                )
              })}
            </nav>
          ) : (
            /* Page thumbnail grid */
            <div className="grid grid-cols-3 gap-2 p-4">
              {pageThumbnails.map((pageIndex) => {
                const isCurrentPage = pageIndex === currentPage
                return (
                  <button
                    key={pageIndex}
                    onClick={() => {
                      onGoToPage(pageIndex)
                      onClose()
                    }}
                    className={`
                      flex aspect-[3/4] flex-col items-center justify-center rounded-lg border-2
                      text-[11px] font-medium transition-all
                      hover:border-[var(--color-primary,#7c3aed)] hover:shadow-sm
                      ${isCurrentPage
                        ? 'border-[var(--color-primary,#7c3aed)] bg-[var(--color-base-50,#f8fafc)]'
                        : 'border-[var(--color-base-200,#e2e8f0)] bg-white'
                      }
                    `}
                  >
                    <span
                      className={`
                        text-[13px] font-bold
                        ${isCurrentPage
                          ? 'text-[var(--color-primary,#7c3aed)]'
                          : 'text-[var(--color-base-500,#64748b)]'
                        }
                      `}
                    >
                      {pageIndex + 1}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer with current page info */}
        <div className="border-t border-[var(--color-base-200,#e2e8f0)] px-4 py-2.5">
          <p className="text-center text-[11px] text-[var(--color-base-400,#94a3b8)]">
            Pagina {currentPage + 1} van {totalPages}
          </p>
        </div>
      </div>
    </>
  )
}
