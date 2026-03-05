'use client'

import React from 'react'
import { Search, X, AlertCircle } from 'lucide-react'
import type { SearchQueryHeaderProps } from './types'

export function SearchQueryHeader({
  query,
  resultCount,
  totalCount,
  didYouMean,
  onClearSearch,
  onDidYouMeanClick,
  className = '',
}: SearchQueryHeaderProps) {
  return (
    <div
      className={`bg-[var(--bg)] border border-[var(--grey)] rounded-xl p-5 mb-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Main search info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center justify-center w-10 h-10 bg-[var(--teal)]/10 rounded-lg shrink-0">
            <Search className="w-5 h-5 text-[var(--teal)]" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-bold text-[var(--text)] mb-1">
              Zoekresultaten voor:{' '}
              <span className="text-[var(--teal)]">"{query}"</span>
            </h2>

            <p className="text-[14px] text-[var(--grey-dark)]">
              {resultCount === 0 ? (
                <span className="text-[var(--coral)] font-semibold">
                  Geen producten gevonden
                </span>
              ) : (
                <>
                  <strong className="text-[var(--text)] font-bold">{resultCount}</strong>{' '}
                  {resultCount === 1 ? 'product gevonden' : 'producten gevonden'}
                  {totalCount && totalCount > resultCount && (
                    <> van {totalCount} totaal</>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Clear button */}
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="btn btn-ghost btn-sm flex items-center gap-2"
            aria-label="Wis zoekopdracht"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Wissen</span>
          </button>
        )}
      </div>

      {/* Did you mean suggestion */}
      {didYouMean && didYouMean.toLowerCase() !== query.toLowerCase() && (
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--grey)]">
          <AlertCircle className="w-4 h-4 text-[var(--amber)]" aria-hidden="true" />
          <p className="text-[13px] text-[var(--grey-dark)]">
            Bedoelde je:{' '}
            {onDidYouMeanClick ? (
              <button
                type="button"
                onClick={() => onDidYouMeanClick(didYouMean)}
                className="font-bold text-[var(--teal)] hover:text-[var(--teal-dark)] underline decoration-dotted underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/30 rounded"
              >
                {didYouMean}
              </button>
            ) : (
              <span className="font-bold text-[var(--teal)]">{didYouMean}</span>
            )}
          </p>
        </div>
      )}

      {/* No results help text */}
      {resultCount === 0 && (
        <div className="pt-3 border-t border-[var(--grey)] mt-3">
          <p className="text-[13px] text-[var(--grey-dark)] mb-2">
            <strong className="text-[var(--text)]">Tips:</strong>
          </p>
          <ul className="text-[13px] text-[var(--grey-dark)] space-y-1 list-disc list-inside">
            <li>Controleer de spelling</li>
            <li>Probeer andere zoekwoorden</li>
            <li>Gebruik algemenere termen</li>
            <li>Pas de filters aan voor meer resultaten</li>
          </ul>
        </div>
      )}
    </div>
  )
}
