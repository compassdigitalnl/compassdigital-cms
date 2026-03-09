/**
 * ProductCompareBar Component (C9)
 *
 * Bottom-fixed bar showing selected products for comparison. Users can add products
 * from shop pages, view side-by-side specs, and make informed purchase decisions.
 *
 * Features:
 * - Navy background (dark theme)
 * - Max 4 product slots (filled + empty)
 * - Product cards with thumbnail, name, remove button
 * - Empty slots with dashed border
 * - Compare button (teal) to view comparison table
 * - Close button to hide bar
 * - Horizontal scroll for overflow
 * - Slide-up animation
 * - LocalStorage persistence (optional)
 *
 * @category E-commerce / Product Discovery
 * @component C9
 */

'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRightLeft, X } from 'lucide-react'
import type { ProductCompareBarProps } from './types'

export const ProductCompareBar: React.FC<ProductCompareBarProps> = ({
  products,
  maxProducts = 4,
  onCompare,
  onRemove,
  onClose,
  isVisible = true,
  persistKey,
  className = '',
}) => {
  // Persist to localStorage (optional)
  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      localStorage.setItem(persistKey, JSON.stringify(products.map((p) => p.id)))
    }
  }, [products, persistKey])

  const handleCompare = () => {
    if (products.length < 2) return
    const productIds = products.map((p) => p.id)
    onCompare(productIds)
  }

  const emptySlots = Math.max(0, maxProducts - products.length)
  const compareButtonDisabled = products.length < 2

  return (
    <div
      className={`compare-bar fixed bottom-0 left-0 right-0 bg-navy-600 z-[280] transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] py-3.5 ${isVisible ? 'translate-y-0' : 'translate-y-full'} ${className}`}
      role="complementary"
      aria-label="Product vergelijking"
      aria-hidden={!isVisible}
    >
      <div className="compare-inner max-w-screen-xl mx-auto px-6 flex items-center gap-3.5">
        {/* Label */}
        <div className="compare-label text-white/50 text-[13px] font-semibold flex-shrink-0 hidden md:block">
          Vergelijken ({products.length}/{maxProducts})
        </div>

        {/* Product Items (scrollable) */}
        <div className="compare-items flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {/* Filled Slots */}
          {products.map((product) => (
            <div
              key={product.id}
              className="compare-item flex items-center gap-2 p-2 px-3 bg-white/[0.08] border border-white/10 rounded-[10px] flex-shrink-0"
            >
              {/* Thumbnail */}
              <div className="ci-img w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-lg overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>📦</span>
                )}
              </div>

              {/* Name */}
              <div className="ci-name text-[13px] font-semibold text-white max-w-[140px] whitespace-nowrap overflow-hidden text-ellipsis">
                {product.name}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(product.id)}
                className="btn btn-ghost ci-remove w-6 h-6 flex items-center justify-center"
                aria-label={`Verwijder ${product.name} uit vergelijking`}
              >
                <X className="w-3 h-3 text-white/50" aria-hidden="true" />
              </button>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="compare-slot-empty w-[120px] h-[52px] border-2 border-dashed border-white/10 rounded-[10px] flex items-center justify-center text-xs text-white/20 flex-shrink-0"
              aria-hidden="true"
            >
              Leeg
            </div>
          ))}
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompare}
          disabled={compareButtonDisabled}
          className={`btn btn-primary compare-btn flex items-center gap-1.5 flex-shrink-0 ${compareButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Vergelijk geselecteerde producten"
          title={
            compareButtonDisabled ? 'Selecteer minimaal 2 producten om te vergelijken' : undefined
          }
        >
          <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Vergelijk</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-ghost compare-close w-[42px] h-[42px] flex items-center justify-center flex-shrink-0"
          aria-label="Sluit vergelijkingsbalk"
        >
          <X className="w-4.5 h-4.5 text-white/50" aria-hidden="true" />
        </button>
      </div>

      {/* Custom scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default ProductCompareBar
