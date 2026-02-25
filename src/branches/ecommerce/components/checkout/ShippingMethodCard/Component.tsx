'use client'

import React from 'react'
import { Truck, Zap, Package, Clock } from 'lucide-react'
import type { ShippingMethodCardProps, ShippingMethodIcon } from './types'

/**
 * Icon mapping for shipping methods
 */
const iconMap: Record<ShippingMethodIcon, typeof Truck> = {
  truck: Truck,
  zap: Zap,
  package: Package,
  clock: Clock,
}

/**
 * Icon color mapping (CSS class names)
 */
const iconColorMap: Record<ShippingMethodIcon, string> = {
  truck: 'icon-teal',
  zap: 'icon-amber',
  package: 'icon-teal',
  clock: 'icon-teal',
}

/**
 * ShippingMethodCard Component
 *
 * Selectable shipping method card for checkout flow.
 * Radio button card with icon, name, delivery time, and price.
 *
 * @example
 * ```tsx
 * <ShippingMethodCard
 *   method={{
 *     id: '1',
 *     name: 'Standaard',
 *     slug: 'standard',
 *     icon: 'truck',
 *     deliveryTime: '1-2 werkdagen',
 *     price: 6.95,
 *   }}
 *   selected={selectedId === '1'}
 *   onSelect={(id) => setSelectedId(id)}
 * />
 * ```
 */
export function ShippingMethodCard({
  method,
  selected,
  onSelect,
  disabled = false,
  currencySymbol = '€',
  className = '',
}: ShippingMethodCardProps) {
  const Icon = iconMap[method.icon]
  const iconColorClass = iconColorMap[method.icon]
  const isFree = method.price === 0 || method.isFree

  // Format price for Dutch locale (comma as decimal separator)
  const formatPrice = (price: number): string => {
    return `${currencySymbol} ${price.toFixed(2).replace('.', ',')}`
  }

  return (
    <label
      className={`shipping-method ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${className}`}
    >
      {/* Hidden radio input (visually replaced by card border) */}
      <input
        type="radio"
        name="shipping-method"
        value={method.id}
        checked={selected}
        onChange={() => onSelect(method.id)}
        disabled={disabled}
        className="shipping-method__radio"
        aria-label={`${method.name}, ${method.deliveryTime}, ${isFree ? 'Gratis' : formatPrice(method.price)}`}
      />

      {/* Header: Icon + Name */}
      <div className="shipping-method__header">
        <Icon className={`shipping-method__icon ${iconColorClass}`} size={20} aria-hidden="true" />
        <div className="shipping-method__name">{method.name}</div>
      </div>

      {/* Delivery Time */}
      <div className="shipping-method__time">{method.deliveryTime}</div>

      {/* Price */}
      <div className={`shipping-method__price ${isFree ? 'free' : ''}`}>
        {isFree ? 'Gratis' : formatPrice(method.price)}
      </div>

      <style jsx>{`
        .shipping-method {
          background: white;
          border: 2px solid var(--grey);
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .shipping-method:hover:not(.disabled) {
          border-color: var(--teal);
          box-shadow: 0 4px 12px rgba(0, 137, 123, 0.1);
        }

        .shipping-method.selected {
          border-color: var(--teal);
          background: var(--white);
        }

        .shipping-method.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .shipping-method__radio {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 20px;
          height: 20px;
          accent-color: var(--teal);
          cursor: pointer;
        }

        .shipping-method.disabled .shipping-method__radio {
          cursor: not-allowed;
        }

        .shipping-method__radio:focus-visible {
          outline: 3px solid var(--teal-glow);
          outline-offset: 2px;
          border-radius: 50%;
        }

        .shipping-method__header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .shipping-method__icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .shipping-method__icon.icon-teal {
          color: var(--teal);
        }

        .shipping-method__icon.icon-amber {
          color: var(--amber);
        }

        .shipping-method__name {
          font-weight: 700;
          font-size: 14px;
          color: var(--navy);
          line-height: 1.4;
        }

        .shipping-method__time {
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.4;
        }

        .shipping-method__price {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
          margin-top: auto;
          line-height: 1.2;
        }

        .shipping-method__price.free {
          color: var(--green);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .shipping-method {
            padding: 18px;
          }

          .shipping-method__name {
            font-size: 13px;
          }

          .shipping-method__time {
            font-size: 12px;
          }

          .shipping-method__price {
            font-size: 16px;
          }
        }
      `}</style>
    </label>
  )
}
