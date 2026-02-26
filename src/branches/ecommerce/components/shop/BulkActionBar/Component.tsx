'use client'

import React from 'react'
import { ShoppingCart, FileText, Scale, X, Package } from 'lucide-react'
import type { BulkActionBarProps } from './types'

export function BulkActionBar({
  selectedProducts,
  onAddToCart,
  onRequestQuote,
  onCompare,
  onClearSelection,
  className = '',
}: BulkActionBarProps) {
  const selectedCount = selectedProducts.length

  if (selectedCount === 0) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[var(--navy)] border-t-2 border-[var(--teal)] shadow-[var(--shadow-xl)] ${className}`}
      role="toolbar"
      aria-label="Bulkacties voor geselecteerde producten"
    >
      <div className="max-w-[var(--container-width, 1792px)] mx-auto px-4 md:px-6 lg:px-24 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Selection count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--teal)]/15 border border-[var(--teal)]/30">
              <Package className="w-5 h-5 text-[var(--teal)]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">
                {selectedCount} {selectedCount === 1 ? 'product' : 'producten'} geselecteerd
              </p>
              <p className="text-[12px] text-white/60">
                Kies een actie hieronder om bulk te bewerken
              </p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            {/* Add to Cart */}
            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(selectedProducts)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--teal)] hover:bg-[var(--teal-light)] text-white font-semibold text-[13px] rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/50 focus:ring-offset-2 focus:ring-offset-[var(--navy)]"
                aria-label={`Voeg ${selectedCount} producten toe aan winkelwagen`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Toevoegen aan winkelwagen</span>
                <span className="sm:hidden">Toevoegen</span>
              </button>
            )}

            {/* Request Quote */}
            {onRequestQuote && (
              <button
                type="button"
                onClick={() => onRequestQuote(selectedProducts)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[13px] rounded-lg border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[var(--navy)]"
                aria-label={`Vraag offerte aan voor ${selectedCount} producten`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Offerte aanvragen</span>
                <span className="sm:hidden">Offerte</span>
              </button>
            )}

            {/* Compare */}
            {onCompare && selectedCount >= 2 && selectedCount <= 4 && (
              <button
                type="button"
                onClick={() => onCompare(selectedProducts)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[13px] rounded-lg border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[var(--navy)]"
                aria-label={`Vergelijk ${selectedCount} producten`}
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">Vergelijken</span>
              </button>
            )}

            {/* Clear Selection */}
            <button
              type="button"
              onClick={onClearSelection}
              className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[var(--navy)]"
              aria-label="Wis selectie"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
