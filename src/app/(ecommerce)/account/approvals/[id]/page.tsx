'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import ApprovalDetailTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/ApprovalDetailTemplate'
import type { ApprovalRequest, ApprovalTimelineEvent } from '@/branches/ecommerce/b2b/components/account/approvals/types'
import { toast } from '@/lib/toast'

export default function ApprovalDetailPage() {
  if (!isFeatureEnabled('approval_workflow')) notFound()

  const { id } = useParams<{ id: string }>()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [request, setRequest] = useState<ApprovalRequest | null>(null)
  const [budgetInfo, setBudgetInfo] = useState({ monthlyBudget: undefined as number | undefined, monthlyUsed: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user || !id) return
    fetch(`/api/account/approvals/${id}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setRequest(data.request)
        setBudgetInfo({ monthlyBudget: data.monthlyBudget, monthlyUsed: data.monthlyUsed || 0 })
      })
      .catch(() => toast.error('Kon goedkeuringsverzoek niet laden'))
      .finally(() => setIsLoading(false))
  }, [user, id])

  const timeline = useMemo<ApprovalTimelineEvent[]>(() => {
    if (!request) return []
    const events: ApprovalTimelineEvent[] = [
      { type: 'created', date: request.createdAt, user: request.requestedBy.name },
    ]
    if (request.note) {
      events.push({ type: 'note', date: request.createdAt, user: request.requestedBy.name, message: request.note })
    }
    if (request.status === 'approved' && request.reviewedAt) {
      events.push({ type: 'approved', date: request.reviewedAt, user: request.approver?.name, message: request.reviewNote })
    }
    if (request.status === 'rejected' && request.reviewedAt) {
      events.push({ type: 'rejected', date: request.reviewedAt, user: request.approver?.name, message: request.reviewNote })
    }
    if (request.status === 'expired' && request.expiresAt) {
      events.push({ type: 'expired', date: request.expiresAt })
    }
    return events
  }, [request])

  const handleAction = async (action: 'approved' | 'rejected', note?: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/account/approvals/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, reviewNote: note }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRequest(data.request)
      toast.success(action === 'approved' ? 'Bestelling goedgekeurd' : 'Bestelling afgewezen')
    } catch {
      toast.error('Kon beoordeling niet opslaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading || !user) return <AccountLoadingSkeleton variant="page" />
  if (!request) return <div className="text-center py-12 text-gray-500">Verzoek niet gevonden</div>

  const companyRole = (user as any).companyRole || 'viewer'
  const canApprove = companyRole === 'admin' || companyRole === 'manager'

  return (
    <ApprovalDetailTemplate
      request={request}
      timeline={timeline}
      canApprove={canApprove}
      monthlyBudget={budgetInfo.monthlyBudget}
      monthlyUsed={budgetInfo.monthlyUsed}
      onApprove={(note) => handleAction('approved', note)}
      onReject={(note) => handleAction('rejected', note)}
      isSubmitting={isSubmitting}
    />
  )
}
