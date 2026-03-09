/**
 * AddToCartToast Manager
 *
 * Manages multiple AddToCart toasts with stacking (max 3 visible)
 */

'use client'

import React, { useState, useCallback, createContext, useContext, type ReactNode } from 'react'
import { AddToCartToast } from './Component'
import type { CartToastProduct, ToastItem } from './types'

interface AddToCartToastContextValue {
  /**
   * Show a new "Add to Cart" toast
   */
  showToast: (product: CartToastProduct) => void

  /**
   * Active toasts
   */
  toasts: ToastItem[]
}

const AddToCartToastContext = createContext<AddToCartToastContextValue | undefined>(undefined)

export function AddToCartToastProvider({
  children,
  maxToasts = 3,
  autoDismiss = 5000,
  onViewCart,
  onContinueShopping,
}: {
  children: ReactNode
  maxToasts?: number
  autoDismiss?: number
  onViewCart?: () => void
  onContinueShopping?: () => void
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback(
    (product: CartToastProduct) => {
      const newToast: ToastItem = {
        id: crypto.randomUUID(),
        product,
        createdAt: Date.now(),
      }

      setToasts((prev) => {
        // Add new toast to the beginning and limit to maxToasts
        const updated = [newToast, ...prev].slice(0, maxToasts)
        return updated
      })
    },
    [maxToasts]
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value: AddToCartToastContextValue = {
    showToast,
    toasts,
  }

  return (
    <AddToCartToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="add-to-cart-toast-container">
        {toasts.map((toast) => (
          <AddToCartToast
            key={toast.id}
            product={toast.product}
            show={true}
            autoDismiss={autoDismiss}
            onClose={() => removeToast(toast.id)}
            onViewCart={onViewCart}
            onContinueShopping={onContinueShopping}
          />
        ))}
      </div>

      <style jsx>{`
        .add-to-cart-toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 600;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .add-to-cart-toast-container {
            top: 16px;
            right: 16px;
            left: 16px;
          }
        }
      `}</style>
    </AddToCartToastContext.Provider>
  )
}

/**
 * Hook to show AddToCart toasts
 */
export function useAddToCartToast() {
  const context = useContext(AddToCartToastContext)

  if (!context) {
    throw new Error('useAddToCartToast must be used within AddToCartToastProvider')
  }

  return context
}
