/**
 * AddToCartToast (c3)
 *
 * Specialized toast notification for "Add to Cart" actions in e-commerce.
 * Shows product info, quantity, price calculation, and action buttons.
 *
 * @category E-commerce Components
 * @subcategory Feedback / Cart
 */

'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, ShoppingCart, ArrowRight, X } from 'lucide-react'
import Image from 'next/image'
import type { AddToCartToastProps, CartToastProduct } from './types'

export function AddToCartToast({
  product,
  show,
  autoDismiss = 5000,
  onClose,
  onViewCart,
  onContinueShopping,
}: AddToCartToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (show) {
      // Trigger slide-in animation after mount
      setTimeout(() => setIsVisible(true), 10)

      // Auto-dismiss timer
      if (autoDismiss > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, autoDismiss)

        return () => clearTimeout(timer)
      }
    }
  }, [show, autoDismiss])

  const handleClose = () => {
    setIsClosing(true)
    setIsVisible(false)

    // Wait for slide-out animation to complete
    setTimeout(() => {
      onClose()
    }, 400)
  }

  const handleViewCart = () => {
    if (onViewCart) {
      onViewCart()
    }
    handleClose()
  }

  const handleContinue = () => {
    if (onContinueShopping) {
      onContinueShopping()
    }
    handleClose()
  }

  if (!show && !isClosing) return null

  // Calculate total price
  const totalPrice = (product.quantity * product.price).toFixed(2)
  const formattedPrice = `€${product.price.toFixed(2)}`

  return (
    <>
      <div
        className={`add-to-cart-toast ${isVisible ? 'show' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Product Image */}
        <div className="toast-img">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="52px"
            />
          ) : (
            <div className="toast-img-placeholder">📦</div>
          )}
        </div>

        {/* Toast Body */}
        <div className="toast-body">
          {/* Success Message */}
          <div className="toast-success">
            <CheckCircle size={14} strokeWidth={2.5} />
            Toegevoegd aan winkelwagen
          </div>

          {/* Product Name & Variant */}
          <div className="toast-name">
            {product.name}
            {product.variant && ` — ${product.variant}`}
          </div>

          {/* Quantity & Price */}
          <div className="toast-meta">
            {product.quantity} × {formattedPrice} = €{totalPrice}
          </div>

          {/* Action Buttons */}
          <div className="toast-actions">
            <button
              type="button"
              onClick={handleViewCart}
              className="toast-btn primary"
            >
              <ShoppingCart size={13} strokeWidth={2.5} />
              Naar winkelwagen
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="toast-btn outline"
            >
              <ArrowRight size={13} strokeWidth={2.5} />
              Verder winkelen
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="toast-close"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>

        {/* Progress Bar (auto-dismiss timer) */}
        {autoDismiss > 0 && (
          <div className="toast-progress">
            <div
              className="toast-progress-bar"
              style={{ animationDuration: `${autoDismiss}ms` }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .add-to-cart-toast {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 14px;
          box-shadow: var(--shadow-lg);
          padding: 16px 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          width: 380px;
          max-width: calc(100vw - 40px);
          transform: translateX(120%);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto;
          position: relative;
          overflow: hidden;
        }

        .add-to-cart-toast.show {
          transform: translateX(0);
        }

        /* Product Image */
        .toast-img {
          width: 52px;
          height: 52px;
          background: var(--grey-light);
          border-radius: 10px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .toast-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        /* Toast Body */
        .toast-body {
          flex: 1;
          min-width: 0;
        }

        /* Success Label */
        .toast-success {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 4px;
        }

        /* Product Name */
        .toast-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.3;
        }

        /* Quantity & Price */
        .toast-meta {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: 2px;
        }

        /* Action Buttons */
        .toast-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .toast-btn {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .toast-btn.primary {
          background: var(--teal);
          color: var(--white);
        }

        .toast-btn.primary:hover {
          background: var(--navy);
        }

        .toast-btn.outline {
          background: var(--white);
          color: var(--navy);
          border: 1.5px solid var(--grey);
        }

        .toast-btn.outline:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        /* Close Button */
        .toast-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--grey-mid);
          transition: all 0.15s;
        }

        .toast-close:hover {
          background: var(--grey-light);
        }

        /* Progress Bar */
        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--grey-light);
          border-radius: 0 0 14px 14px;
          overflow: hidden;
        }

        .toast-progress-bar {
          height: 100%;
          background: var(--teal);
          border-radius: 0 0 14px 14px;
          animation: toastTimer linear forwards;
        }

        @keyframes toastTimer {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .add-to-cart-toast {
            width: calc(100vw - 32px);
            padding: 14px 16px;
          }

          .toast-actions {
            flex-direction: column;
            gap: 6px;
          }

          .toast-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}

export default AddToCartToast
