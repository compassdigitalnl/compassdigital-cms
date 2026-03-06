'use client'

import React from 'react'
import Link from 'next/link'
import { Receipt, CheckCircle } from 'lucide-react'
import type { OrderSummaryProps } from './types'

const ROW_STYLES = {
  default: 'text-[var(--color-text-primary)]',
  muted: 'text-[var(--color-text-secondary)]',
  success: 'text-[var(--color-success,#00C853)] font-bold',
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  title = 'Besteloverzicht',
  subtitle,
  sections,
  totalLabel,
  totalValue,
  totalSubtext,
  confirmLabel,
  confirmHref,
  onConfirm,
  confirmNote,
  children,
  className = '',
}) => {
  return (
    <div
      className={`sticky top-[88px] overflow-hidden rounded-[18px] border-[1.5px] border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] shadow-[var(--shadow-md,0_8px_24px_rgba(10,22,40,0.08))] ${className}`}
    >
      {/* Header */}
      <div
        className="px-[22px] py-5"
        style={{ background: 'linear-gradient(135deg, var(--color-text-primary, #0A1628), var(--color-text-primary, #121F33))' }}
      >
        <div className="flex items-center gap-1.5 font-heading text-base font-extrabold text-white">
          <Receipt className="h-4 w-4 text-[var(--color-primary-light)]" />
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-white/40">{subtitle}</div>
        )}
      </div>

      {/* Body */}
      <div className="px-[22px] py-5">
        {sections.map((section, si) => (
          <div
            key={si}
            className={`pb-3.5 ${
              si < sections.length - 1
                ? 'mb-3.5 border-b border-[var(--color-border,#E8ECF1)]'
                : ''
            }`}
          >
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {section.label}
            </div>
            {section.rows.map((row, ri) => (
              <div
                key={ri}
                className={`flex justify-between py-1 text-sm ${ROW_STYLES[row.variant || 'default']}`}
              >
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Total */}
        <div className="flex items-end justify-between border-t-2 border-[var(--color-text-primary,#0A1628)] pt-3">
          <div>
            {totalLabel && (
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {totalLabel}
              </div>
            )}
            <div className="font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
              {totalValue}
            </div>
          </div>
          {totalSubtext && (
            <div className="text-right text-xs text-[var(--color-text-muted)]">{totalSubtext}</div>
          )}
        </div>

        {/* Confirm button */}
        <div className="mt-4">
          {confirmHref ? (
            <Link
              href={confirmHref}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-none font-heading text-base font-extrabold text-white no-underline shadow-[0_4px_16px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #00695C))' }}
            >
              <CheckCircle className="h-[18px] w-[18px]" />
              {confirmLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-none font-heading text-base font-extrabold text-white shadow-[0_4px_16px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #00695C))' }}
            >
              <CheckCircle className="h-[18px] w-[18px]" />
              {confirmLabel}
            </button>
          )}
        </div>

        {confirmNote && (
          <div className="mt-1.5 text-center text-xs text-[var(--color-text-muted)]">
            {confirmNote}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
