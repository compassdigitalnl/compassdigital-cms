/**
 * QuickAddToCart Component
 *
 * A quick add-to-cart button with inline quantity selector.
 * Perfect for product grids where users want to order multiple items quickly.
 *
 * Features:
 * - Compact button that expands to show quantity controls
 * - +/- buttons for quantity adjustment
 * - Direct input for quantity
 * - Smooth animations
 * - Stock validation
 * - Keyboard accessible
 *
 * @category E-commerce
 * @component EC-QuickAdd
 */

'use client'

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'

export interface QuickAddToCartProps {
  /** Product ID */
  productId: string
  /** Product name (for ARIA labels) */
  productName: string
  /** Available stock */
  stock: number
  /** Stock status */
  stockStatus: 'in-stock' | 'low' | 'out'
  /** Minimum order quantity */
  minQty?: number
  /** Maximum order quantity */
  maxQty?: number
  /** Callback when adding to cart */
  onAddToCart: (productId: string, quantity: number) => void
  /** Compact mode (just icon, no text) */
  compact?: boolean
  /** Custom className */
  className?: string
}

export function QuickAddToCart({
  productId,
  productName,
  stock,
  stockStatus,
  minQty = 1,
  maxQty,
  onAddToCart,
  compact = false,
  className = '',
}: QuickAddToCartProps) {
  const [quantity, setQuantity] = useState(minQty)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const effectiveMaxQty = maxQty || stock

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity < effectiveMaxQty) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > minQty) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= minQty && value <= effectiveMaxQty) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (stockStatus === 'out') return

    setIsAdding(true)
    try {
      await onAddToCart(productId, quantity)
      setShowSuccess(true)
      setIsExpanded(false)
      setQuantity(minQty)

      // Reset success state after 2s
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const isDisabled = stockStatus === 'out'

  return (
    <div className={`quick-add ${className}`}>
      {!isExpanded ? (
        // Collapsed State - Single Button
        <button
          className={`quick-add__button ${showSuccess ? 'quick-add__button--success' : ''}`}
          onClick={handleExpand}
          disabled={isDisabled}
          aria-label={`Snelbestellen ${productName}`}
          type="button"
        >
          {showSuccess ? (
            <>
              <Check size={18} />
              {!compact && <span className="quick-add__button-text">Toegevoegd!</span>}
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {!compact && <span className="quick-add__button-text">Snelbestellen</span>}
            </>
          )}
        </button>
      ) : (
        // Expanded State - Quantity Controls + Add Button
        <div className="quick-add__controls">
          <div className="quick-add__quantity">
            <button
              className="quick-add__qty-btn"
              onClick={handleDecrement}
              disabled={quantity <= minQty}
              aria-label="Verminder aantal"
              type="button"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              className="quick-add__qty-input"
              value={quantity}
              onChange={handleQuantityChange}
              min={minQty}
              max={effectiveMaxQty}
              aria-label="Aantal"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            <button
              className="quick-add__qty-btn"
              onClick={handleIncrement}
              disabled={quantity >= effectiveMaxQty}
              aria-label="Verhoog aantal"
              type="button"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            className="quick-add__add-btn"
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={`Voeg ${quantity} stuks toe aan winkelwagen`}
            type="button"
          >
            {isAdding ? (
              <span className="quick-add__spinner" />
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .quick-add {
          position: relative;
          z-index: 1;
        }

        /* ═══ COLLAPSED BUTTON ═══ */
        .quick-add__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--teal);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 137, 123, 0.3);
          white-space: nowrap;
        }

        .quick-add__button:hover:not(:disabled) {
          background: var(--teal-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 137, 123, 0.4);
        }

        .quick-add__button:active:not(:disabled) {
          transform: translateY(0);
        }

        .quick-add__button:focus {
          outline: 3px solid var(--teal-glow);
          outline-offset: 2px;
        }

        .quick-add__button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .quick-add__button--success {
          background: var(--green);
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }

        .quick-add__button--success:hover {
          background: var(--green);
        }

        .quick-add__button :global(svg) {
          flex-shrink: 0;
        }

        .quick-add__button-text {
          display: inline-block;
        }

        /* ═══ EXPANDED CONTROLS ═══ */
        .quick-add__controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          border: 1.5px solid var(--grey);
          border-radius: 10px;
          padding: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: quick-add-expand 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes quick-add-expand {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Quantity Controls */
        .quick-add__quantity {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg);
          border-radius: 8px;
          padding: 2px;
        }

        .quick-add__qty-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 6px;
          color: var(--navy);
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-add__qty-btn:hover:not(:disabled) {
          background: var(--teal-glow);
          border-color: var(--teal);
          color: var(--teal);
        }

        .quick-add__qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .quick-add__qty-btn :global(svg) {
          flex-shrink: 0;
        }

        .quick-add__qty-input {
          width: 40px;
          height: 28px;
          text-align: center;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          appearance: textfield;
        }

        .quick-add__qty-input::-webkit-outer-spin-button,
        .quick-add__qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .quick-add__qty-input:focus {
          outline: none;
        }

        /* Add Button */
        .quick-add__add-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--teal);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 6px rgba(0, 137, 123, 0.25);
        }

        .quick-add__add-btn:hover:not(:disabled) {
          background: var(--teal-dark);
          transform: scale(1.05);
        }

        .quick-add__add-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .quick-add__add-btn :global(svg) {
          flex-shrink: 0;
        }

        /* Spinner */
        .quick-add__spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: quick-add-spin 0.6s linear infinite;
        }

        @keyframes quick-add-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Mobile Optimization */
        @media (max-width: 640px) {
          .quick-add__button {
            padding: 10px 14px;
            font-size: 12px;
          }

          .quick-add__qty-input {
            width: 36px;
          }
        }
      `}</style>
    </div>
  )
}
