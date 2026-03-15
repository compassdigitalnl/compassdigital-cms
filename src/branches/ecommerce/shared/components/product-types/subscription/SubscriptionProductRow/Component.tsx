'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { SubscriptionProductRowProps } from './types'
export type { Badge, SubscriptionProductRowProps } from './types'

export const SubscriptionProductRow: React.FC<SubscriptionProductRowProps> = ({
  id,
  icon,
  emoji,
  title,
  badges = [],
  editionCount,
  frequency = 'Maandelijks',
  pricePerMonth,
  totalPrice,
  savingsPercent,
  onSubscribe,
  onLearnMore,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const badgeVariantStyles = {
    popular: 'bg-teal-100 text-teal-700',
    personal: 'bg-gray-100 text-gray-700',
    gift: 'bg-coral-50 text-coral',
  }

  return (
    <div
      className={`product-row bg-white border-[1.5px] border-gray-200 rounded-[14px] p-4 px-5 transition-all hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-px grid items-center gap-x-5 gap-y-1.5 ${className}`}
      style={{
        gridTemplateColumns: '60px 1fr auto auto auto',
        gridTemplateRows: 'auto auto',
      }}
    >
      {/* Column 1: Icon (spans both rows) */}
      <div
        className="product-type-icon w-15 h-15 text-3xl flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ gridColumn: '1', gridRow: '1 / 3', alignSelf: 'center' }}
      >
        {emoji || icon || '📦'}
      </div>

      {/* Column 2: Badges (row 1) */}
      {badges.length > 0 && (
        <div
          className="product-badges flex gap-1 flex-wrap"
          style={{ gridColumn: '2', gridRow: '1', alignSelf: 'end' }}
        >
          {badges.map((badge, index) => {
            const BadgeIcon = badge.icon ? LucideIcons[badge.icon] as React.ComponentType<{ className?: string }> : null
            return (
              <span
                key={index}
                className={`badge px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${badgeVariantStyles[badge.variant]}`}
              >
                {BadgeIcon && <BadgeIcon className="w-[11px] h-[11px]" />}
                {badge.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Column 2: Edition count (row 2) */}
      <div
        className="product-edition-count text-xs text-gray-600"
        style={{ gridColumn: '2', gridRow: '2', alignSelf: 'start' }}
      >
        {title && <span className="font-bold mr-2">{title}</span>}
        {editionCount && <span>{editionCount} edities · {frequency}</span>}
      </div>

      {/* Column 3: Price per month (spans both rows) */}
      {pricePerMonth && (
        <div
          className="product-price-month text-center"
          style={{ gridColumn: '3', gridRow: '1 / 3', alignSelf: 'center' }}
        >
          <div className="text-xl font-extrabold text-gray-900">
            €{formatPriceStr(pricePerMonth)}
          </div>
          <div className="text-[10px] text-gray-500">per maand</div>
        </div>
      )}

      {/* Column 4: Total + Savings (spans both rows) */}
      <div
        className="product-price-total text-right"
        style={{ gridColumn: '4', gridRow: '1 / 3', alignSelf: 'center' }}
      >
        {totalPrice && (
          <div className="text-sm font-bold text-gray-900 font-mono">
            €{formatPriceStr(totalPrice)}
          </div>
        )}
        {savingsPercent && savingsPercent > 0 && (
          <div className="text-[10px] font-bold text-green">
            -{savingsPercent}%
          </div>
        )}
      </div>

      {/* Column 5: Actions (spans both rows) */}
      <div
        className="product-actions flex gap-2"
        style={{ gridColumn: '5', gridRow: '1 / 3', alignSelf: 'center' }}
      >
        {onSubscribe && (
          <Button
            onClick={() => onSubscribe(id)}
            size="sm"
            className="btn btn-primary btn-sm"
          >
            Start
          </Button>
        )}
        {onLearnMore && (
          <Button
            onClick={() => onLearnMore(id)}
            size="sm"
            variant="outline"
            className="btn btn-outline-neutral btn-sm"
          >
            Info
          </Button>
        )}
      </div>
    </div>
  )
}

export default SubscriptionProductRow
