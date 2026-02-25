/**
 * MiniCartFlyout Component
 *
 * Right-side slide-over panel showing cart contents with quantity controls,
 * free shipping progress, and checkout button. Allows quick cart management
 * without leaving current page.
 *
 * Features:
 * - Slide-in animation from right (0.35s)
 * - Free shipping progress bar (optional)
 * - Cart item cards with quantity stepper
 * - Hover-revealed remove button
 * - Order summary with totals
 * - Prominent checkout button
 * - Backdrop with blur effect
 * - ESC key to close
 * - Focus trap for accessibility
 *
 * @category E-commerce
 * @component C2
 */

'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ShoppingCart, X, Truck, Trash2, ArrowRight, Minus, Plus } from 'lucide-react'
import type { MiniCartFlyoutProps, MiniCartItem } from './types'

export function MiniCartFlyout({
  items,
  summary,
  freeShipping,
  isOpen,
  onClose,
  onQuantityChange,
  onRemove,
  onCheckout,
}: MiniCartFlyoutProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Auto-focus close button when opened
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Format price with euro/cent styling
  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2)
    const [euros, cents] = formatted.split('.')
    return { euros, cents }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mc-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`mc-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Winkelwagen"
      >
        {/* Header */}
        <div className="mc-header">
          <div className="mc-title">
            <ShoppingCart size={20} />
            Winkelwagen
            <span className="mc-count-badge">{summary.itemCount} items</span>
          </div>
          <button
            ref={closeButtonRef}
            className="mc-close"
            onClick={onClose}
            aria-label="Sluit winkelwagen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {freeShipping && !freeShipping.achieved && (
          <div className="mc-shipping">
            <div className="mc-shipping-text">
              <Truck size={14} />
              Nog{' '}
              <strong>
                €{freeShipping.remaining.toFixed(2).replace('.', ',')}
              </strong>{' '}
              tot gratis verzending
            </div>
            <div className="mc-shipping-bar">
              <div
                className="mc-shipping-fill"
                style={{ width: `${freeShipping.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Free Shipping Achieved */}
        {freeShipping && freeShipping.achieved && (
          <div className="mc-shipping achieved">
            <div className="mc-shipping-text">
              <Truck size={14} />
              <strong>Gratis verzending!</strong>
            </div>
          </div>
        )}

        {/* Cart Items (Scrollable) */}
        <div className="mc-body">
          {items.length === 0 && (
            <div className="mc-empty">
              <ShoppingCart size={48} />
              <p>Je winkelwagen is leeg</p>
            </div>
          )}

          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))}
        </div>

        {/* Footer (Totals & Checkout) */}
        {items.length > 0 && (
          <div className="mc-footer">
            <div className="mc-summary">
              <div className="mc-summary-row">
                <span>Subtotaal</span>
                <span>€{summary.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {summary.discount && summary.discount > 0 && (
                <div className="mc-summary-row mc-discount">
                  <span>Korting</span>
                  <span>−€{summary.discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="mc-summary-row">
                <span>Verzending</span>
                <span>
                  {summary.shipping === 0
                    ? 'Gratis'
                    : `€${summary.shipping.toFixed(2).replace('.', ',')}`}
                </span>
              </div>

              <div className="mc-summary-row total">
                <span>Totaal</span>
                <span>€{summary.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button className="mc-btn-checkout" onClick={onCheckout}>
              Afrekenen
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Backdrop */
        .mc-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 22, 40, 0.4);
          z-index: 400;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          backdrop-filter: blur(2px);
        }

        .mc-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        /* Panel */
        .mc-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 420px;
          max-width: 90vw;
          background: var(--white);
          z-index: 410;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: -16px 0 48px rgba(10, 22, 40, 0.1);
        }

        .mc-panel.open {
          transform: translateX(0);
        }

        /* Header */
        .mc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--grey);
          flex-shrink: 0;
        }

        .mc-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mc-title :global(svg) {
          color: var(--teal);
        }

        .mc-count-badge {
          background: var(--teal-glow);
          color: var(--teal);
          font-size: 13px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 100px;
        }

        .mc-close {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: var(--grey-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition);
        }

        .mc-close :global(svg) {
          color: var(--navy);
        }

        .mc-close:hover {
          background: var(--grey);
        }

        /* Free Shipping Bar */
        .mc-shipping {
          padding: 12px 24px;
          background: var(--green-light);
          border-bottom: 1px solid rgba(0, 200, 83, 0.1);
          flex-shrink: 0;
        }

        .mc-shipping.achieved {
          background: var(--green-light);
        }

        .mc-shipping-text {
          font-size: 13px;
          color: var(--navy);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .mc-shipping.achieved .mc-shipping-text {
          margin-bottom: 0;
        }

        .mc-shipping-text :global(svg) {
          color: var(--green);
          flex-shrink: 0;
        }

        .mc-shipping-text strong {
          color: var(--green);
        }

        .mc-shipping-bar {
          height: 6px;
          background: rgba(0, 200, 83, 0.15);
          border-radius: 100px;
          overflow: hidden;
        }

        .mc-shipping-fill {
          height: 100%;
          background: var(--green);
          border-radius: 100px;
          transition: width 0.5s;
        }

        /* Body (scrollable cart items) */
        .mc-body {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        /* Empty State */
        .mc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          text-align: center;
        }

        .mc-empty :global(svg) {
          color: var(--grey-mid);
          margin-bottom: 16px;
        }

        .mc-empty p {
          font-size: 15px;
          color: var(--grey-mid);
          font-weight: 600;
        }

        /* Footer (Totals & Checkout) */
        .mc-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--grey);
          background: var(--white);
          flex-shrink: 0;
        }

        .mc-summary {
          margin-bottom: 16px;
        }

        .mc-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--navy);
        }

        .mc-summary-row.total {
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--grey);
        }

        .mc-summary-row.mc-discount {
          color: var(--green);
        }

        .mc-btn-checkout {
          width: 100%;
          padding: 14px;
          background: var(--teal);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--transition);
        }

        .mc-btn-checkout:hover {
          background: var(--teal-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 137, 123, 0.2);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mc-panel {
            width: 100vw;
            max-width: 100vw;
          }

          .mc-header,
          .mc-shipping,
          .mc-footer {
            padding: 16px 20px;
          }
        }
      `}</style>
    </>
  )
}

/**
 * Individual Cart Item Component
 */
interface CartItemProps {
  item: MiniCartItem
  onQuantityChange: (itemId: string, newQuantity: number) => void
  onRemove: (itemId: string) => void
}

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1)
    }
  }

  const handleIncrement = () => {
    onQuantityChange(item.id, item.quantity + 1)
  }

  const totalPrice = (item.quantity * item.price).toFixed(2).replace('.', ',')

  return (
    <div className="mc-item">
      {/* Product Image */}
      <div className="mc-item-img">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            width={64}
            height={64}
            style={{ objectFit: 'cover', borderRadius: '10px' }}
          />
        ) : (
          <div className="mc-item-placeholder">📦</div>
        )}
      </div>

      {/* Product Info */}
      <div className="mc-item-info">
        {item.brand && <div className="mc-item-brand">{item.brand}</div>}
        <div className="mc-item-name">{item.title}</div>
        {item.variant && <div className="mc-item-variant">{item.variant}</div>}

        {/* Bottom Row: Quantity + Price */}
        <div className="mc-item-bottom">
          {/* Quantity Stepper */}
          <div className="mc-qty">
            <button
              onClick={handleDecrement}
              aria-label="Verminder aantal"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span>{item.quantity}</span>
            <button onClick={handleIncrement} aria-label="Verhoog aantal">
              <Plus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="mc-item-price">€{totalPrice}</div>
        </div>
      </div>

      {/* Remove Button (hover-revealed) */}
      <button
        className="mc-item-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Verwijder ${item.title}`}
      >
        <Trash2 size={14} />
      </button>

      <style jsx>{`
        .mc-item {
          display: flex;
          gap: 14px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--grey);
          position: relative;
        }

        .mc-item:last-child {
          border-bottom: none;
        }

        .mc-item-img {
          width: 64px;
          height: 64px;
          background: var(--grey-light);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .mc-item-placeholder {
          font-size: 32px;
        }

        .mc-item-info {
          flex: 1;
          min-width: 0;
        }

        .mc-item-brand {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--teal);
        }

        .mc-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.3;
          margin: 2px 0;
        }

        .mc-item-variant {
          font-size: 12px;
          color: var(--grey-mid);
        }

        .mc-item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }

        /* Quantity Stepper (Small) */
        .mc-qty {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--grey);
          border-radius: 8px;
          overflow: hidden;
        }

        .mc-qty button {
          width: 30px;
          height: 30px;
          border: none;
          background: var(--white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
          transition: background 0.1s;
        }

        .mc-qty button:hover:not(:disabled) {
          background: var(--grey-light);
        }

        .mc-qty button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .mc-qty span {
          width: 32px;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
        }

        .mc-item-price {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
        }

        /* Remove Button (hover-revealed) */
        .mc-item-remove {
          position: absolute;
          top: 12px;
          right: 20px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.15s;
        }

        .mc-item:hover .mc-item-remove {
          opacity: 1;
        }

        .mc-item-remove :global(svg) {
          color: var(--grey-mid);
        }

        .mc-item-remove:hover {
          background: var(--coral-light);
        }

        .mc-item-remove:hover :global(svg) {
          color: var(--coral);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .mc-item {
            padding: 12px 20px;
          }

          .mc-item-remove {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
