'use client'

import React from 'react'
import Link from 'next/link'
import { Check, X, Star, ArrowRight, Zap } from 'lucide-react'
import type { PricingPlanCardProps } from './types'

const BUTTON_STYLES = {
  fill: 'bg-[var(--color-primary)] text-white shadow-[0_4px_12px_var(--color-primary-glow)] hover:opacity-90',
  outline: 'bg-[var(--color-surface,white)] text-[var(--color-text-primary)] border-2 border-[var(--color-border,#E8ECF1)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  navy: 'bg-[var(--color-text-primary,#0A1628)] text-white hover:bg-[var(--color-primary)]',
}

const BUTTON_ICONS = {
  fill: Zap,
  outline: ArrowRight,
  navy: ArrowRight,
}

export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  plan,
  onSelect,
  className = '',
}) => {
  const variant = plan.buttonVariant || (plan.highlighted ? 'fill' : 'outline')
  const ButtonIcon = BUTTON_ICONS[variant]
  const isCustomPrice = plan.price === null

  const handleClick = () => {
    if (onSelect) onSelect(plan)
  }

  return (
    <div
      className={`
        relative flex flex-col rounded-[20px] border-2 bg-[var(--color-surface,white)] p-7 transition-all duration-[250ms]
        ${plan.highlighted
          ? 'scale-[1.02] border-[var(--color-primary)] shadow-[var(--shadow-lg,0_16px_48px_rgba(10,22,40,0.12))]'
          : 'border-[var(--color-border,#E8ECF1)] hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lg,0_16px_48px_rgba(10,22,40,0.12))]'
        }
        ${className}
      `}
    >
      {plan.highlighted && plan.highlightLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark,#00695C)] px-4 py-1 text-[11px] font-extrabold text-white">
          <Star className="mr-1 inline h-3 w-3" />
          {plan.highlightLabel}
        </div>
      )}

      {plan.icon && (
        <div
          className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-[14px] text-[22px]"
          style={{ background: plan.highlighted ? 'var(--color-primary-glow)' : 'var(--color-grey-light,#F1F4F8)' }}
        >
          {plan.icon}
        </div>
      )}

      <div className="mb-0.5 font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
        {plan.name}
      </div>

      {plan.description && (
        <p className="mb-4 text-[13px] leading-snug text-[var(--color-text-muted)]">
          {plan.description}
        </p>
      )}

      <div className="mb-4">
        {plan.originalPrice != null && (
          <div className="text-[13px] text-[var(--color-text-muted)] line-through">
            &euro;{plan.originalPrice}/mnd
          </div>
        )}
        {isCustomPrice ? (
          <div className="font-heading text-[40px] font-extrabold leading-none">
            {plan.priceLabel || 'Op maat'}
          </div>
        ) : (
          <div className="font-heading text-[40px] font-extrabold leading-none">
            &euro;{plan.price}
            {plan.priceSuffix && (
              <span className="text-sm font-normal text-[var(--color-text-muted)]">
                {plan.priceSuffix}
              </span>
            )}
          </div>
        )}
        {plan.billedLabel && (
          <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">{plan.billedLabel}</div>
        )}
      </div>

      {plan.href ? (
        <Link
          href={plan.href}
          className={`mb-4 flex h-12 w-full items-center justify-center gap-1.5 rounded-[var(--border-radius,12px)] font-heading text-sm font-extrabold no-underline transition-all duration-200 ${BUTTON_STYLES[variant]}`}
        >
          <ButtonIcon className="h-4 w-4" />
          {plan.buttonLabel || `${plan.name} kiezen`}
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`mb-4 flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[var(--border-radius,12px)] border-none font-heading text-sm font-extrabold transition-all duration-200 ${BUTTON_STYLES[variant]}`}
        >
          <ButtonIcon className="h-4 w-4" />
          {plan.buttonLabel || `${plan.name} kiezen`}
        </button>
      )}

      {/* Features — flex-1 pushes this to fill remaining space for equal height cards */}
      <div className="flex flex-1 flex-col justify-end gap-1.5">
        {plan.features && plan.features.length > 0 && plan.features.map((f, i) => (
          <div
            key={i}
            className={`flex items-start gap-1.5 text-[13px] leading-snug ${
              f.included
                ? f.highlighted
                  ? 'font-bold text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)]'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            {f.included ? (
              <Check className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-[var(--color-success,#00C853)]" />
            ) : (
              <X className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-[var(--color-border,#E8ECF1)]" />
            )}
            {f.text}
          </div>
        ))}
      </div>
    </div>
  )
}
