/**
 * CartButton Component
 *
 * Shopping cart button with badge showing item count
 * Integrates with cart state management
 */

'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'

export interface CartButtonProps {
  showBadge?: boolean
  showOnMobile?: boolean
  count?: number // Optional override count
  className?: string
}

export function CartButton({
  showBadge = true,
  showOnMobile = true,
  count,
  className = '',
}: CartButtonProps) {
  const [cartCount, setCartCount] = useState(count ?? 0)

  // Listen for cart updates
  useEffect(() => {
    // Get initial cart count from localStorage or cart state
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem('cart')
        if (cart) {
          const cartData = JSON.parse(cart)
          const totalItems = cartData.items?.reduce(
            (sum: number, item: any) => sum + (item.quantity || 1),
            0,
          )
          setCartCount(totalItems || 0)
        }
      } catch (error) {
        console.error('Failed to parse cart data:', error)
      }
    }

    updateCartCount()

    // Listen for cart update events
    const handleCartUpdate = (event: CustomEvent) => {
      setCartCount(event.detail?.count || 0)
    }

    window.addEventListener('cartUpdate', handleCartUpdate as EventListener)
    return () => window.removeEventListener('cartUpdate', handleCartUpdate as EventListener)
  }, [])

  // Override count if provided
  useEffect(() => {
    if (count !== undefined) {
      setCartCount(count)
    }
  }, [count])

  return (
    <a
      href="/cart"
      className={`cart-button ${!showOnMobile ? 'hide-mobile' : ''} ${className}`}
      aria-label={`Shopping cart (${cartCount} items)`}
    >
      <div className="cart-icon-wrapper">
        <ShoppingCart size={20} aria-hidden="true" />
        {showBadge && cartCount > 0 && (
          <span className="cart-badge" aria-label={`${cartCount} items in cart`}>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>

      <style jsx>{`
        .cart-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2, 8px);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s ease;
        }

        .cart-button:hover {
          background: var(--color-surface, #f5f5f5);
        }

        .cart-icon-wrapper {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-accent, #00d4aa);
          color: var(--color-white, #fff);
          font-size: var(--font-size-xs, 10px);
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Mobile: hide if showOnMobile is false */
        @media (max-width: 767px) {
          .cart-button.hide-mobile {
            display: none;
          }
        }
      `}</style>
    </a>
  )
}
