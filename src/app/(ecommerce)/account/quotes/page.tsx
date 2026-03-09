'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import type { QuoteSummary } from '@/branches/ecommerce/b2b/components/account/quotes'
import QuotesListTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/QuotesListTemplate'

export default function QuotesListPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { user, isLoading: authLoading } = useAccountAuth()
  const [quotes, setQuotes] = useState<QuoteSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/account/quotes?limit=50', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setQuotes(
          (data.docs || []).map((q: any) => ({
            id: q.id,
            quoteNumber: q.quoteNumber,
            status: q.status,
            products: q.products || [],
            quotedPrice: q.quotedPrice,
            validUntil: q.validUntil,
            companyName: q.companyName,
            createdAt: q.createdAt,
          })),
        )
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  return <QuotesListTemplate quotes={quotes} isLoading={authLoading || isLoading} />
}
