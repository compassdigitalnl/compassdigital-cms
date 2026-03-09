'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import {
  QuoteDetailHeader,
  QuoteProductsDetail,
  QuoteActions,
  QuoteContactInfo,
} from '@/branches/ecommerce/b2b/components/account/quotes'
import type { QuoteDetailTemplateProps } from './types'

export default function QuoteDetailTemplate({
  quote,
  isLoading,
  error,
  accepting,
  rejecting,
  onAccept,
  onReject,
}: QuoteDetailTemplateProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (isLoading) return <AccountLoadingSkeleton variant="detail" />

  if (error || !quote) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-lg font-extrabold text-gray-900 mb-2">{error || 'Offerte niet gevonden'}</h2>
        <Link href="/account/quotes" className="btn btn-ghost btn-sm mt-4">
          <ArrowLeft className="w-4 h-4" />
          Terug naar offertes
        </Link>
      </div>
    )
  }

  const isExpired =
    quote.status === 'quoted' &&
    quote.validUntil &&
    new Date(quote.validUntil) < new Date()

  const canAccept = quote.status === 'quoted' && !isExpired
  const canReject = quote.status === 'quoted'

  function handleRejectClick() {
    setShowRejectForm(true)
  }

  function handleRejectConfirm(reason: string) {
    onReject(reason)
    setShowRejectForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/account/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        style={{ color: 'var(--teal)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Alle offertes
      </Link>

      {/* Header with status + action buttons */}
      <QuoteDetailHeader
        quoteNumber={quote.quoteNumber}
        status={quote.status}
        submittedAt={quote.submittedAt || quote.createdAt}
        validUntil={quote.validUntil}
        convertedToOrder={quote.convertedToOrder}
        isExpired={!!isExpired}
        canAccept={!!canAccept}
        canReject={!!canReject}
        onAccept={onAccept}
        onReject={handleRejectClick}
        accepting={accepting}
      />

      {/* Reject form */}
      {showRejectForm && (
        <QuoteActions
          onReject={handleRejectConfirm}
          onCancel={() => setShowRejectForm(false)}
          rejecting={rejecting}
        />
      )}

      {/* Products table */}
      <QuoteProductsDetail
        products={quote.products}
        quotedPrice={quote.quotedPrice}
        status={quote.status}
      />

      {/* Contact info */}
      <QuoteContactInfo
        companyName={quote.companyName}
        contactPerson={quote.contactPerson}
        email={quote.email}
        phone={quote.phone}
        notes={quote.notes}
      />
    </div>
  )
}
