'use client'

import React, { useEffect, useState, useRef } from 'react'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { QuickViewModalProps, ProductVariant } from './types'

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onViewFull,
  addToCartText = 'In winkelwagen',
  viewFullText = 'Bekijk volledige productpagina',
  showViewFullLink = true,
  className = '',
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { vatLabelForClass, formatPriceStr } = usePriceMode()

  // Initialize selected variant (find default or first available)
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant =
        product.variants.find((v) => v.default && v.available) ||
        product.variants.find((v) => v.available)
      setSelectedVariant(defaultVariant || null)
    } else {
      setSelectedVariant(null)
    }
  }, [product])

  // Handle modal open/close effects
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Focus close button for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)

      // Announce to screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.className = 'sr-only'
      announcement.textContent = 'Product quick view geopend'
      document.body.appendChild(announcement)
      setTimeout(() => announcement.remove(), 1000)
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      // Reset state
      setQuantity(1)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, selectedVariant?.id || null, quantity)
    }
    onClose()
  }

  // Handle view full
  const handleViewFull = () => {
    if (onViewFull) {
      onViewFull(product.id)
    }
  }

  // Quantity handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  // Stock status display
  const getStockDisplay = () => {
    const { status, quantity: stockQty, message } = product.stock

    if (message) {
      return { text: message, color: 'text-theme-green' }
    }

    switch (status) {
      case 'in_stock':
        return {
          text: stockQty ? `Op voorraad (${stockQty})` : 'Op voorraad',
          color: 'text-theme-green',
        }
      case 'low_stock':
        return {
          text: stockQty ? `Laatste ${stockQty} stuks` : 'Beperkte voorraad',
          color: 'text-theme-amber',
        }
      case 'out_of_stock':
        return { text: 'Niet op voorraad', color: 'text-theme-coral' }
      case 'pre_order':
        return { text: 'Pre-order beschikbaar', color: 'text-theme-teal' }
      default:
        return { text: 'Op voorraad', color: 'text-theme-green' }
    }
  }

  const stockDisplay = getStockDisplay()

  // Badge color mapping
  const badgeColorClasses = {
    amber: 'bg-theme-amber',
    teal: 'bg-theme-teal',
    green: 'bg-theme-green',
    coral: 'bg-theme-coral',
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-[500] flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      } ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qv-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-theme-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={`relative grid max-h-[90vh] w-[820px] max-w-[92vw] overflow-hidden rounded-[20px] bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        } md:grid-cols-2`}
        style={{
          boxShadow: '0 16px 48px rgba(10, 22, 40, 0.12)',
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-[10px] bg-theme-grey-light transition-colors hover:bg-theme-grey"
          aria-label="Sluit quick view"
        >
          <X className="h-[18px] w-[18px] text-theme-navy" />
        </button>

        {/* Left Column: Product Image */}
        <div className="relative flex min-h-[200px] items-center justify-center bg-theme-grey-light md:min-h-[400px]">
          {/* Badge Overlay */}
          {product.badge && (
            <div
              className={`absolute left-4 top-4 rounded-md px-2.5 py-1 text-[11px] font-bold text-white ${
                badgeColorClasses[product.badgeColor || 'amber']
              }`}
            >
              {product.badge}
            </div>
          )}

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col overflow-y-auto p-8">
          {/* Brand */}
          {product.brand && (
            <div className="text-[11px] font-bold uppercase tracking-wider text-theme-teal">
              {product.brand}
            </div>
          )}

          {/* Product Name */}
          <h2
            id="qv-modal-title"
            className="font-heading mt-1 text-[22px] font-extrabold leading-tight text-theme-navy"
          >
            {product.name}
          </h2>

          {/* SKU */}
          {product.sku && (
            <div className="font-mono mt-2 text-xs text-theme-grey-mid">Art. {product.sku}</div>
          )}

          {/* Stock Status */}
          <div className={`mt-3 flex items-center gap-1.5 text-[13px] font-semibold ${stockDisplay.color}`}>
            <span
              className={`h-[7px] w-[7px] rounded-full ${
                product.stock.status === 'in_stock'
                  ? 'bg-theme-green'
                  : product.stock.status === 'low_stock'
                    ? 'bg-theme-amber'
                    : product.stock.status === 'out_of_stock'
                      ? 'bg-theme-coral'
                      : 'bg-theme-teal'
              }`}
            />
            {stockDisplay.text}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="font-heading text-[26px] font-extrabold text-theme-navy">
              €{formatPriceStr(product.price, product.taxClass)}
            </span>
            {product.unit && <span className="text-[13px] text-theme-grey-mid">{vatLabelForClass(product.taxClass)} · {product.unit}</span>}
            {!product.unit && <span className="text-[13px] text-theme-grey-mid">{vatLabelForClass(product.taxClass)}</span>}
          </div>

          {/* Staffel Pricing Hint */}
          {product.staffelHint && (
            <div className="mt-1 text-[13px] font-semibold text-theme-teal">
              {product.staffelHint}
            </div>
          )}

          {/* Variant Selector (if variants exist) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-4">
              <div className="mb-1.5 text-xs font-bold text-theme-navy">
                {product.variants[0]?.name.length <= 3 ? 'Maat' : 'Variant'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => variant.available && setSelectedVariant(variant)}
                    disabled={!variant.available}
                    className={`flex h-[38px] min-w-[44px] items-center justify-center rounded-lg border-2 px-3 text-[13px] font-bold transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-theme-teal bg-theme-teal-glow text-theme-teal'
                        : variant.available
                          ? 'border-theme-grey text-theme-navy hover:border-theme-teal'
                          : 'cursor-not-allowed border-theme-grey bg-theme-grey-light text-theme-grey-mid opacity-40'
                    }`}
                    aria-pressed={selectedVariant?.id === variant.id}
                    aria-label={`Selecteer variant ${variant.name}`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions: Quantity + Add to Cart */}
          <div className="mt-auto flex gap-2 pt-4">
            {/* Quantity Stepper */}
            <div className="flex items-center overflow-hidden rounded-[10px] border-2 border-theme-grey">
              <button
                onClick={decreaseQuantity}
                className="flex h-11 w-[38px] items-center justify-center bg-white text-theme-navy transition-colors hover:bg-theme-grey-light"
                aria-label="Verlaag aantal"
              >
                <span className="text-base font-bold">−</span>
              </button>
              <span className="font-mono w-11 text-center text-[15px] font-semibold text-theme-navy">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="flex h-11 w-[38px] items-center justify-center bg-white text-theme-navy transition-colors hover:bg-theme-grey-light"
                aria-label="Verhoog aantal"
              >
                <span className="text-base font-bold">+</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock.status === 'out_of_stock'}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-theme-teal text-sm font-bold text-white shadow-md transition-all hover:bg-theme-navy disabled:cursor-not-allowed disabled:bg-theme-grey-mid disabled:opacity-50"
              style={{
                boxShadow: '0 4px 16px rgba(0, 137, 123, 0.3)',
              }}
              aria-label={`Voeg ${quantity} ${quantity === 1 ? 'product' : 'producten'} toe aan winkelwagen`}
            >
              <ShoppingCart className="h-[17px] w-[17px]" />
              {addToCartText}
            </button>
          </div>

          {/* View Full Product Link */}
          {showViewFullLink && (
            <div className="mt-2.5 text-center">
              <a
                href={product.slug ? `/products/${product.slug}` : '#'}
                onClick={(e) => {
                  if (onViewFull) {
                    e.preventDefault()
                    handleViewFull()
                  }
                }}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-theme-teal underline decoration-theme-teal underline-offset-2 transition-colors hover:text-theme-navy"
              >
                {viewFullText}
                <ArrowRight className="h-[13px] w-[13px]" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
