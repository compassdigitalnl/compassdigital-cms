'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { cn } from '@/utilities/cn'
import type { MiniCartContextValue, MiniCartProviderProps } from './types'

const MiniCartContext = createContext<MiniCartContextValue | undefined>(undefined)

export function MiniCartProvider({
  children,
  enableMiniCart = true,
}: MiniCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { items, itemCount, total, removeItem, updateQuantity } = useCart()
  const { displayPrice, formatPriceStr } = usePriceMode()

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const value: MiniCartContextValue = {
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    itemCount,
  }

  return (
    <MiniCartContext.Provider value={value}>
      {children}

      {/* MiniCart Flyout */}
      {enableMiniCart && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 bg-black/40 backdrop-blur-sm z-[399] transition-opacity',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in Panel */}
          <div
            className={cn(
              'fixed top-0 right-0 bottom-0 w-[420px] max-w-[90vw] bg-white z-[400] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
              isOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border,#e5e7eb)]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Winkelwagen
                </h2>
                {itemCount > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost w-9 h-9 flex items-center justify-center"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingCart className="w-16 h-16 mb-4" style={{ color: 'var(--color-border)' }} />
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    Je winkelwagen is leeg
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Voeg producten toe om te beginnen
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border,#e5e7eb)]">
                  {items.map((item) => {
                    const rawPrice = item.unitPrice ?? item.price
                    const pricePerUnit = displayPrice(rawPrice, item.taxClass as any) ?? rawPrice
                    return (
                      <div key={item.id} className="flex gap-4 p-4">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg bg-[var(--color-surface,#f9fafb)] border border-[var(--color-border,#e5e7eb)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {item.title}
                          </div>
                          {item.sku && (
                            <div className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                              Art. {item.sku}
                            </div>
                          )}
                          <div className="text-sm font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
                            €{formatPriceStr(rawPrice, item.taxClass as any)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="inline-flex items-center border border-[var(--color-border,#e5e7eb)] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center bg-[var(--color-surface,#f9fafb)] hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center bg-[var(--color-surface,#f9fafb)] hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-coral-50 transition-colors text-gray-400 hover:text-coral"
                              aria-label="Verwijderen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="ml-auto text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                              €{formatPriceStr(rawPrice * item.quantity, item.taxClass as any)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border,#e5e7eb)] p-6 flex-shrink-0">
                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Totaal
                  </span>
                  <span className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                    €{formatPriceStr(items.reduce((sum, it) => sum + (it.unitPrice ?? it.price) * it.quantity, 0))}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Bekijk winkelwagen
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-outline-neutral w-full flex items-center justify-center gap-2"
                  >
                    Afrekenen
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </MiniCartContext.Provider>
  )
}

export function useMiniCart() {
  const context = useContext(MiniCartContext)
  if (!context) {
    throw new Error('useMiniCart must be used within MiniCartProvider')
  }
  return context
}
