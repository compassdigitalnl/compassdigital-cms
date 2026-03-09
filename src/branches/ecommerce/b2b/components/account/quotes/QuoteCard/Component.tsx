'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, Send, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react'
import type { QuoteCardProps } from './types'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  new: { label: 'Nieuw', color: '#6B7280', bg: '#F3F4F6', icon: <Clock className="w-3.5 h-3.5" /> },
  processing: { label: 'In behandeling', color: '#D97706', bg: '#FEF3C7', icon: <Clock className="w-3.5 h-3.5" /> },
  quoted: { label: 'Offerte ontvangen', color: '#2563EB', bg: '#DBEAFE', icon: <Send className="w-3.5 h-3.5" /> },
  accepted: { label: 'Geaccepteerd', color: '#059669', bg: '#D1FAE5', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: 'Afgewezen', color: '#DC2626', bg: '#FEE2E2', icon: <XCircle className="w-3.5 h-3.5" /> },
  expired: { label: 'Verlopen', color: '#9CA3AF', bg: '#F3F4F6', icon: <AlertCircle className="w-3.5 h-3.5" /> },
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const isExpired =
    quote.status === 'quoted' &&
    quote.validUntil &&
    new Date(quote.validUntil) < new Date()

  const status = STATUS_CONFIG[isExpired ? 'expired' : quote.status] || STATUS_CONFIG.new
  const productNames = quote.products
    .slice(0, 3)
    .map((p) => p.name)
    .join(', ')
  const moreCount = Math.max(0, quote.products.length - 3)

  return (
    <Link
      href={`/account/quotes/${quote.id}`}
      className="block rounded-xl p-5 transition-all hover:shadow-md"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--grey)',
        boxShadow: 'var(--sh-sm)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>
              {quote.quoteNumber}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.icon}
              {status.label}
            </span>
          </div>
          <p className="text-sm truncate" style={{ color: 'var(--grey-dark)' }}>
            {productNames}
            {moreCount > 0 && ` +${moreCount} meer`}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--grey-mid)' }}>
            {new Date(quote.createdAt).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {quote.quotedPrice != null && (
            <span className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
              {new Intl.NumberFormat('nl-NL', {
                style: 'currency',
                currency: 'EUR',
              }).format(quote.quotedPrice)}
            </span>
          )}
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--grey-mid)' }} />
        </div>
      </div>
    </Link>
  )
}
