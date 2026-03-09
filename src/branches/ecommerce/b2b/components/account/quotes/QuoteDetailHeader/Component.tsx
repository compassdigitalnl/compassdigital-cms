'use client'

import React from 'react'
import Link from 'next/link'
import {
  Clock,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Package,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import type { QuoteDetailHeaderProps } from './types'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  new: { label: 'Nieuw', color: '#6B7280', bg: '#F3F4F6', icon: <Clock className="w-4 h-4" /> },
  processing: { label: 'In behandeling', color: '#D97706', bg: '#FEF3C7', icon: <Clock className="w-4 h-4" /> },
  quoted: { label: 'Offerte ontvangen', color: '#2563EB', bg: '#DBEAFE', icon: <Send className="w-4 h-4" /> },
  accepted: { label: 'Geaccepteerd', color: '#059669', bg: '#D1FAE5', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: 'Afgewezen', color: '#DC2626', bg: '#FEE2E2', icon: <XCircle className="w-4 h-4" /> },
  expired: { label: 'Verlopen', color: '#9CA3AF', bg: '#F3F4F6', icon: <AlertCircle className="w-4 h-4" /> },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function QuoteDetailHeader({
  quoteNumber,
  status: rawStatus,
  submittedAt,
  validUntil,
  convertedToOrder,
  isExpired,
  canAccept,
  canReject,
  onAccept,
  onReject,
  accepting,
}: QuoteDetailHeaderProps) {
  const status = STATUS_CONFIG[isExpired ? 'expired' : rawStatus] || STATUS_CONFIG.new

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--white)', border: '1px solid var(--grey)', boxShadow: 'var(--sh-sm)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>
              {quoteNumber}
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.icon}
              {status.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--grey-mid)' }}>
            Aangevraagd op {formatDate(submittedAt)}
          </p>
        </div>

        {canAccept && (
          <div className="flex items-center gap-3">
            {canReject && (
              <button onClick={onReject} className="btn btn-ghost btn-sm">
                <XCircle className="w-4 h-4" />
                Afwijzen
              </button>
            )}
            <button onClick={onAccept} className="btn btn-primary" disabled={accepting}>
              {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Offerte accepteren
            </button>
          </div>
        )}
      </div>

      {/* Expiration warning */}
      {isExpired && validUntil && (
        <div className="mt-4 p-3 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E' }}>
          <p className="text-sm font-medium">
            Deze offerte is verlopen op {formatDate(validUntil)}.
            <Link href="/account/quotes/new" className="underline ml-1">
              Vraag een nieuwe offerte aan
            </Link>
          </p>
        </div>
      )}

      {/* Valid until notice */}
      {rawStatus === 'quoted' && !isExpired && validUntil && (
        <div className="mt-4 p-3 rounded-lg" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
          <p className="text-sm font-medium">
            <Calendar className="w-4 h-4 inline mr-1" />
            Geldig tot {formatDate(validUntil)}
          </p>
        </div>
      )}

      {/* Converted order link */}
      {convertedToOrder && (
        <div className="mt-4 p-3 rounded-lg" style={{ background: '#D1FAE5', color: '#065F46' }}>
          <p className="text-sm font-medium">
            <Package className="w-4 h-4 inline mr-1" />
            Omgezet naar bestelling{' '}
            <Link
              href={`/account/orders/${typeof convertedToOrder === 'object' ? convertedToOrder.id : convertedToOrder}`}
              className="underline font-bold"
            >
              {typeof convertedToOrder === 'object' ? convertedToOrder.orderNumber : 'Bekijk bestelling'}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
