'use client'

import React, { useState } from 'react'
import { ShoppingCart, Heart, Minus, Plus, Check } from 'lucide-react'
import type { ProductActionsProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export const ProductActions: React.FC<ProductActionsProps> = ({
  productId,
  price,
  initialQuantity = 1,
  maxQuantity = 99,
  minQuantity = 1,
  disabled = false,
  loading = false,
  inWishlist = false,
  onAddToCart,
  onQuantityChange,
  onWishlistToggle,
  addToCartLabel = 'In winkelwagen',
  showWishlist = true,
  showTotalPrice = false,
  taxClass,
  className = '',
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [wishlistActive, setWishlistActive] = useState(inWishlist)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { formatPriceStr } = usePriceMode()

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    const clamped = Math.max(minQuantity, Math.min(maxQuantity, newQuantity))
    setQuantity(clamped)
    onQuantityChange?.(clamped)
  }

  // Increment quantity
  const increment = () => handleQuantityChange(quantity + 1)

  // Decrement quantity
  const decrement = () => handleQuantityChange(quantity - 1)

  // Add to cart
  const handleAddToCart = async () => {
    if (disabled || isAdding) return

    setIsAdding(true)
    try {
      await onAddToCart?.(productId, quantity)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    const newState = !wishlistActive
    setWishlistActive(newState)
    await onWishlistToggle?.(productId, newState)
  }

  // Format price (cents → euros, applying B2B/B2C mode)
  const formatPrice = (cents: number): string => {
    return `€ ${formatPriceStr(cents / 100, taxClass)}`
  }

  return (
    <div className={`product-actions ${className}`}>
      {/* Purchase row */}
      <div className="purchase-row">
        {/* Quantity stepper */}
        <div className="qty-wrap">
          <button
            className="qty-btn"
            onClick={decrement}
            disabled={disabled || quantity <= minQuantity}
            aria-label="Aantal verlagen"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            className="qty-val"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || minQuantity)}
            min={minQuantity}
            max={maxQuantity}
            disabled={disabled}
            aria-label="Aantal"
          />
          <button
            className="qty-btn"
            onClick={increment}
            disabled={disabled || quantity >= maxQuantity}
            aria-label="Aantal verhogen"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to cart button */}
        <button
          className={`add-btn ${isAdding ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
          onClick={handleAddToCart}
          disabled={disabled || isAdding || loading}
        >
          {showSuccess ? (
            <>
              <Check className="h-5 w-5" />
              Toegevoegd!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {addToCartLabel}
            </>
          )}
        </button>

        {/* Wishlist button */}
        {showWishlist && (
          <button
            className={`wish-btn ${wishlistActive ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={disabled}
            aria-label={wishlistActive ? 'Verwijder van verlanglijst' : 'Toevoegen aan verlanglijst'}
            aria-pressed={wishlistActive}
          >
            <Heart
              className={`h-5 w-5 ${wishlistActive ? 'fill-current' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Total price (optional) */}
      {showTotalPrice && (
        <div className="total-price">
          Totaal: <span>{formatPrice((price ?? 0) * quantity)}</span>
        </div>
      )}
    </div>
  )
}
