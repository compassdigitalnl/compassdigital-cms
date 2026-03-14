'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  List,
} from 'lucide-react'
import type { FlipbookToolbarProps } from './types'

export const FlipbookToolbar: React.FC<FlipbookToolbarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onToggleFullscreen,
  isFullscreen,
  onToggleTOC,
  magazineName,
  editionTitle,
}) => {
  const [pageInputValue, setPageInputValue] = useState('')
  const [isEditingPage, setIsEditingPage] = useState(false)

  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1)
    }
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1)
    }
  }, [currentPage, totalPages, onPageChange])

  const handlePageInputSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const pageNum = parseInt(pageInputValue, 10)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum - 1) // Convert 1-based to 0-based
      }
      setIsEditingPage(false)
      setPageInputValue('')
    },
    [pageInputValue, totalPages, onPageChange],
  )

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(e.target.value, 10)
      onPageChange(page)
    },
    [onPageChange],
  )

  const progressPercent = totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 0

  return (
    <div
      className={`
        flex flex-col border-t bg-white
        ${isFullscreen ? 'border-[var(--color-base-700,#334155)] bg-[var(--color-base-800,#1e293b)]' : 'border-[var(--color-base-200,#e2e8f0)]'}
      `}
    >
      {/* Page slider/scrubber */}
      <div className="px-4 pt-2">
        <input
          type="range"
          min={0}
          max={totalPages - 1}
          value={currentPage}
          onChange={handleSliderChange}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-base-200,#e2e8f0)] accent-[#7c3aed]"
          style={{
            background: `linear-gradient(to right, #7c3aed 0%, #2563eb ${progressPercent}%, var(--color-base-200, #e2e8f0) ${progressPercent}%)`,
          }}
          aria-label="Blader door paginas"
        />
      </div>

      {/* Main toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 md:gap-3">
        {/* Back button */}
        <Link
          href="/account/bibliotheek"
          className={`
            hidden items-center gap-1 text-[12px] font-medium no-underline transition-colors
            md:inline-flex
            ${isFullscreen
              ? 'text-[var(--color-base-400,#94a3b8)] hover:text-white'
              : 'text-[var(--color-base-500,#64748b)] hover:text-[var(--color-primary,#7c3aed)]'
            }
          `}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Terug
        </Link>

        {/* Mobile back */}
        <Link
          href="/account/bibliotheek"
          className={`
            flex items-center justify-center rounded-lg p-1.5 transition-colors
            md:hidden
            ${isFullscreen
              ? 'text-[var(--color-base-400,#94a3b8)] hover:text-white'
              : 'text-[var(--color-base-500,#64748b)] hover:text-[var(--color-primary,#7c3aed)]'
            }
          `}
          aria-label="Terug naar bibliotheek"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Separator */}
        <div
          className={`hidden h-5 w-px md:block ${
            isFullscreen ? 'bg-[var(--color-base-700,#334155)]' : 'bg-[var(--color-base-200,#e2e8f0)]'
          }`}
        />

        {/* Title (hidden on mobile) */}
        <div className="hidden min-w-0 flex-1 md:block">
          <p
            className={`truncate text-[12px] font-medium ${
              isFullscreen ? 'text-[var(--color-base-300,#cbd5e1)]' : 'text-[var(--color-base-600,#475569)]'
            }`}
          >
            {magazineName}
            <span
              className={`mx-1.5 ${
                isFullscreen ? 'text-[var(--color-base-600,#475569)]' : 'text-[var(--color-base-300,#cbd5e1)]'
              }`}
            >
              &mdash;
            </span>
            {editionTitle}
          </p>
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Navigation controls */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 0}
            className={`
              flex h-8 w-8 items-center justify-center rounded-lg transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed
              ${isFullscreen
                ? 'text-[var(--color-base-300,#cbd5e1)] hover:bg-[var(--color-base-700,#334155)]'
                : 'text-[var(--color-base-600,#475569)] hover:bg-[var(--color-base-100,#f1f5f9)]'
              }
            `}
            aria-label="Vorige pagina"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page number */}
          {isEditingPage ? (
            <form onSubmit={handlePageInputSubmit} className="flex items-center">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                onBlur={() => {
                  setIsEditingPage(false)
                  setPageInputValue('')
                }}
                autoFocus
                className={`
                  h-7 w-12 rounded border text-center text-[12px] font-medium outline-none
                  ${isFullscreen
                    ? 'border-[var(--color-base-600,#475569)] bg-[var(--color-base-700,#334155)] text-white'
                    : 'border-[var(--color-base-300,#cbd5e1)] bg-white text-[var(--color-base-900,#0f172a)]'
                  }
                `}
                aria-label="Ga naar pagina"
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setPageInputValue(String(currentPage + 1))
                setIsEditingPage(true)
              }}
              className={`
                flex items-center gap-0.5 rounded-lg px-2 py-1 text-[12px] font-medium transition-colors
                ${isFullscreen
                  ? 'text-[var(--color-base-300,#cbd5e1)] hover:bg-[var(--color-base-700,#334155)]'
                  : 'text-[var(--color-base-600,#475569)] hover:bg-[var(--color-base-100,#f1f5f9)]'
                }
              `}
              title="Klik om naar een pagina te gaan"
            >
              <span className="font-bold">{currentPage + 1}</span>
              <span className="opacity-50">/</span>
              <span>{totalPages}</span>
            </button>
          )}

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={`
              flex h-8 w-8 items-center justify-center rounded-lg transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed
              ${isFullscreen
                ? 'text-[var(--color-base-300,#cbd5e1)] hover:bg-[var(--color-base-700,#334155)]'
                : 'text-[var(--color-base-600,#475569)] hover:bg-[var(--color-base-100,#f1f5f9)]'
              }
            `}
            aria-label="Volgende pagina"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Separator */}
        <div
          className={`h-5 w-px ${
            isFullscreen ? 'bg-[var(--color-base-700,#334155)]' : 'bg-[var(--color-base-200,#e2e8f0)]'
          }`}
        />

        {/* Table of Contents */}
        <button
          onClick={onToggleTOC}
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg transition-colors
            ${isFullscreen
              ? 'text-[var(--color-base-300,#cbd5e1)] hover:bg-[var(--color-base-700,#334155)]'
              : 'text-[var(--color-base-600,#475569)] hover:bg-[var(--color-base-100,#f1f5f9)]'
            }
          `}
          aria-label="Inhoudsopgave"
          title="Inhoudsopgave"
        >
          <List className="h-4 w-4" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg transition-colors
            ${isFullscreen
              ? 'text-[var(--color-base-300,#cbd5e1)] hover:bg-[var(--color-base-700,#334155)]'
              : 'text-[var(--color-base-600,#475569)] hover:bg-[var(--color-base-100,#f1f5f9)]'
            }
          `}
          aria-label={isFullscreen ? 'Volledig scherm verlaten' : 'Volledig scherm'}
          title={isFullscreen ? 'Volledig scherm verlaten' : 'Volledig scherm'}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
