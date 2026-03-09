'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { toast } from '@/lib/toast'
import QuoteDetailTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/QuoteDetailTemplate'
import type { QuoteDetail } from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/QuoteDetailTemplate/types'

export default function QuoteDetailPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const params = useParams()
  const router = useRouter()
  const quoteId = params?.id as string
  const { user, isLoading: authLoading } = useAccountAuth()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    if (!user || !quoteId) return
    fetch(`/api/account/quotes/${quoteId}`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => setQuote(data.doc))
      .catch(() => setError('Offerte niet gevonden'))
      .finally(() => setIsLoading(false))
  }, [user, quoteId])

  async function handleAccept() {
    if (!quote) return
    setAccepting(true)
    try {
      const res = await fetch(`/api/account/quotes/${quote.id}/accept`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Offerte geaccepteerd!', `Bestelling ${data.orderNumber} is aangemaakt`)
        router.push(`/account/orders/${data.orderId}`)
      } else {
        toast.error(data.error || 'Kon offerte niet accepteren')
        if (data.error?.includes('verlopen')) {
          setQuote((prev) => prev ? { ...prev, status: 'expired' } : prev)
        }
      }
    } catch {
      toast.error('Er is iets misgegaan')
    } finally {
      setAccepting(false)
    }
  }

  async function handleReject(reason: string) {
    if (!quote) return
    setRejecting(true)
    try {
      const res = await fetch(`/api/account/quotes/${quote.id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        toast.success('Offerte afgewezen')
        setQuote((prev) => prev ? { ...prev, status: 'rejected' } : prev)
      } else {
        toast.error('Kon offerte niet afwijzen')
      }
    } catch {
      toast.error('Er is iets misgegaan')
    } finally {
      setRejecting(false)
    }
  }

  return (
    <QuoteDetailTemplate
      quote={quote}
      isLoading={authLoading || isLoading}
      error={error}
      accepting={accepting}
      rejecting={rejecting}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  )
}
