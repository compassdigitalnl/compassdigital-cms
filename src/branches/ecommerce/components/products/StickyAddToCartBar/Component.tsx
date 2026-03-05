/**
 * StickyAddToCartBar Component (C6)
 *
 * Bottom-fixed bar that appears when the main add-to-cart button scrolls out of view.
 * Keeps CTA accessible at all times, improving conversion by reducing scroll-back friction.
 *
 * Features:
 * - Slides up when main CTA out of view, slides down when in view
 * - Product thumbnail + name + meta info
 * - Current price (large, bold)
 * - Size/variant selector (compact)
 * - Add-to-cart button with icon
 * - Responsive: hides meta and variants on mobile
 * - Smooth slide animation (350ms cubic-bezier)
 * - IntersectionObserver for performant scroll detection
 *
 * @category E-commerce / Conversion Optimization
 * @component C6
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { StickyAddToCartBarProps } from './types'

export const StickyAddToCartBar: React.FC<StickyAddToCartBarProps> = ({
  product,
  selectedVariantId,
  onVariantSelect,
  onAddToCart,
  isVisible: controlledVisible,
  triggerElementRef,
  className = '',
  currencySymbol = '€',
  locale = 'nl-NL',
}) => {
  const [internalVisible, setInternalVisible] = useState(false)
  const [currentVariantId, setCurrentVariantId] = useState<string | undefined>(selectedVariantId)
  const { formatPriceFull } = usePriceMode()

  // Use controlled visibility if provided, otherwise use internal state
  const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible

  // IntersectionObserver for automatic visibility detection
  useEffect(() => {
    if (controlledVisible !== undefined || !triggerElementRef?.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show sticky bar when trigger element is NOT visible
          setInternalVisible(!entry.isIntersecting)
        })
      },
      {
        threshold: 0,
        rootMargin: '100px 0px 0px 0px', // 100px buffer
      },
    )

    const element = triggerElementRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [triggerElementRef, controlledVisible])

  // Sync variant selection
  useEffect(() => {
    if (selectedVariantId !== undefined) {
      setCurrentVariantId(selectedVariantId)
    }
  }, [selectedVariantId])

  const handleVariantClick = (variantId: string) => {
    setCurrentVariantId(variantId)
    onVariantSelect?.(variantId)
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, currentVariantId)
  }

  return (
    <div
      className={`
        sticky-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[300]
        transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        shadow-[0_-4px_20px_rgba(10,22,40,0.08)] py-3
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        ${className}
      `}
      role="complementary"
      aria-label="Vaste winkelwagen-knop"
      aria-hidden={!isVisible}
    >
      <div className="sticky-inner max-w-screen-xl mx-auto px-6 flex items-center gap-4">
        {/* Product Info */}
        <div className="sb-product flex items-center gap-3 flex-1 min-w-0">
          {/* Thumbnail */}
          <div className="sb-img w-11 h-11 bg-gray-100 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-2xl">📦</span>
            )}
          </div>

          {/* Info */}
          <div className="sb-info min-w-0">
            <div className="sb-name text-sm font-bold text-navy-600 whitespace-nowrap overflow-hidden text-ellipsis">
              {product.name}
            </div>
            {product.meta && (
              <div className="sb-meta text-xs text-gray-500 hidden sm:block">{product.meta}</div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="sb-price font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-navy-600 flex-shrink-0">
          {formatPriceFull(product.price, (product as any).taxClass)}
        </div>

        {/* Variant Selector (hidden on mobile) */}
        {product.variants && product.variants.length > 0 && (
          <div className="sb-sizes hidden sm:flex gap-1 flex-shrink-0">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantClick(variant.id)}
                disabled={variant.available === false}
                className={`
                  sb-size w-9 h-8 border-[1.5px] rounded-md flex items-center justify-center
                  text-xs font-bold cursor-pointer transition-all duration-150
                  ${
                    currentVariantId === variant.id
                      ? 'border-teal-600 bg-teal-50 text-teal-600'
                      : 'border-gray-300 hover:border-teal-600'
                  }
                  ${variant.available === false ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                aria-label={`Selecteer variant ${variant.label}`}
                aria-pressed={currentVariantId === variant.id}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="btn btn-primary sb-add flex items-center gap-2 flex-shrink-0"
          aria-label="Toevoegen aan winkelwagen"
        >
          <ShoppingCart className="w-[17px] h-[17px]" aria-hidden="true" />
          <span className="hidden sm:inline">In winkelwagen</span>
        </button>
      </div>
    </div>
  )
}

export default StickyAddToCartBar
