'use client'

import React from 'react'
import { getLucideIconComponent } from '@/branches/ecommerce/components/ui/LucideIcon'
import { Truck } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { ShippingMethodCardProps } from './types'

export function ShippingMethodCard({
  method,
  selected,
  onSelect,
  disabled = false,
  currencySymbol = '€',
  className = '',
}: ShippingMethodCardProps) {
  const Icon = getLucideIconComponent(method.icon) || Truck
  const isFree = method.price === 0 || method.isFree
  const { formatPriceStr } = usePriceMode()

  const formatPrice = (price: number): string => {
    return `${currencySymbol} ${formatPriceStr(price)}`
  }

  return (
    <label
      className={`shipping-method ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${className}`}
    >
      {/* Radio input (left side) */}
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

      {/* Info (center, grows to fill space) */}
      <div className="shipping-method__info">
        <div className="shipping-method__name">
          {method.name}
          <span className={`shipping-method__price ${isFree ? 'free' : ''}`}>
            {isFree ? 'Gratis' : formatPrice(method.price)}
          </span>
        </div>
        <div className="shipping-method__time">{method.deliveryTime}</div>
      </div>

      {/* Icon (right side) */}
      <div className="shipping-method__icon-box" aria-hidden="true">
        <Icon size={20} />
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
          align-items: center;
          gap: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .shipping-method:hover:not(.disabled) {
          border-color: var(--teal-light);
          box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
        }

        .shipping-method.selected {
          border-color: var(--teal);
          background: white;
        }

        .shipping-method.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .shipping-method__radio {
          width: 20px;
          height: 20px;
          accent-color: var(--teal);
          cursor: pointer;
          flex-shrink: 0;
        }

        .shipping-method.disabled .shipping-method__radio {
          cursor: not-allowed;
        }

        .shipping-method:focus-within {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }

        .shipping-method__info {
          flex: 1;
        }

        .shipping-method__name {
          font-weight: 700;
          font-size: 15px;
          color: var(--navy);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }

        .shipping-method__price {
          font-size: 13px;
          font-weight: 600;
          color: var(--grey-dark);
        }

        .shipping-method__price.free {
          color: var(--green);
        }

        .shipping-method__time {
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.4;
        }

        .shipping-method__icon-box {
          width: 48px;
          height: 32px;
          background: var(--grey-light);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--teal);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .shipping-method {
            padding: 16px;
          }

          .shipping-method__name {
            font-size: 14px;
          }

          .shipping-method__time {
            font-size: 12px;
          }

          .shipping-method__icon-box {
            width: 40px;
            height: 24px;
          }
        }
      `}</style>
    </label>
  )
}
