'use client'

import React from 'react'
import Link from 'next/link'
import { FileCheck, Plus } from 'lucide-react'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import { QuoteCard } from '@/branches/ecommerce/b2b/components/account/quotes'
import type { QuotesListTemplateProps } from './types'

export default function QuotesListTemplate({ quotes, isLoading }: QuotesListTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="list" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}
          >
            Offertes
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--grey-mid)' }}>
            Bekijk en beheer je offerteaanvragen
          </p>
        </div>
        <Link href="/account/quotes/new" className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
          Nieuwe offerte
        </Link>
      </div>

      {/* Empty state */}
      {quotes.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--white)', border: '1px solid var(--grey)', boxShadow: 'var(--sh-sm)' }}
        >
          <FileCheck className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--grey-mid)' }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Nog geen offertes
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--grey-mid)' }}>
            Vraag een offerte aan voor producten op maat of grote hoeveelheden.
          </p>
          <Link href="/account/quotes/new" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Offerte aanvragen
          </Link>
        </div>
      )}

      {/* Quote cards */}
      {quotes.length > 0 && (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  )
}
