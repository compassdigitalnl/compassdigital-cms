'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { SubscriptionProductCardProps } from './types'
export type { Badge, SubscriptionProductCardProps } from './types'

export const SubscriptionProductCard: React.FC<SubscriptionProductCardProps> = ({
  id,
  icon,
  emoji,
  title,
  description,
  badges = [],
  frequency = 'Maandelijks',
  editionCount,
  pricePerMonth,
  totalPrice,
  savingsPercent,
  features = [],
  onSubscribe,
  onLearnMore,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const badgeVariantStyles = {
    popular: 'bg-purple-100 text-purple-700',
    personal: 'bg-gray-100 text-gray-700',
    gift: 'bg-red-50 text-red-500',
  }

  return (
    <div
      className={`product-card bg-white border-[1.5px] border-gray-200 rounded-[14px] p-5 transition-all hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 flex flex-col ${className}`}
    >
      {/* Badges */}
      {badges.length > 0 && (
        <div className="product-badges flex gap-1.5 mb-3 flex-wrap">
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

      {/* Icon */}
      <div className="product-type-icon w-12 h-12 text-3xl flex items-center justify-center bg-gray-50 rounded-lg mb-4">
        {emoji || icon || '📦'}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-extrabold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

      {/* Frequency & Edition Count */}
      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">Frequentie:</span> {frequency}
        </div>
        {editionCount && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Edities:</span> {editionCount}
          </div>
        )}
      </div>

      {/* Pricing */}
      {pricePerMonth && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-gray-600">Per maand</span>
            <span className="text-2xl font-extrabold text-gray-900">
              €{formatPriceStr(pricePerMonth)}
            </span>
          </div>
          {totalPrice && (
            <div className="flex items-baseline justify-between text-xs text-gray-500">
              <span>Totaal</span>
              <span className="font-mono">€{formatPriceStr(totalPrice)}</span>
            </div>
          )}
          {savingsPercent && savingsPercent > 0 && (
            <div className="mt-2 text-xs font-bold text-green-600">
              Bespaar {savingsPercent}% op losse edities
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <ul className="space-y-1.5 mb-4 text-sm text-gray-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-[var(--color-primary)] mt-0.5">✓</span>
              <span className="flex-1">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="mt-auto pt-4 space-y-2">
        {onSubscribe && (
          <Button
            onClick={() => onSubscribe(id)}
            className="btn btn-primary w-full"
          >
            Start abonnement
          </Button>
        )}
        {onLearnMore && (
          <Button
            onClick={() => onLearnMore(id)}
            variant="outline"
            className="btn btn-outline-neutral w-full"
          >
            Meer informatie
          </Button>
        )}
      </div>
    </div>
  )
}

export default SubscriptionProductCard
