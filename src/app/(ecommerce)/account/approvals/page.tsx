'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import ApprovalsTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/ApprovalsTemplate'
import type { ApprovalRequest } from '@/branches/ecommerce/b2b/components/account/approvals/types'
import { toast } from '@/lib/toast'

export default function ApprovalsPage() {
  if (!isFeatureEnabled('approval_workflow')) notFound()

  const { user, isLoading: authLoading } = useAccountAuth()
  const [requests, setRequests] = useState<ApprovalRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/account/approvals', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setRequests(data.requests || []))
      .catch(() => toast.error('Kon goedkeuringsverzoeken niet laden'))
      .finally(() => setIsLoading(false))
  }, [user])

  if (authLoading || isLoading || !user) return <AccountLoadingSkeleton variant="page" />

  const companyRole = (user as any).companyRole || 'viewer'
  const canApprove = companyRole === 'admin' || companyRole === 'manager'

  return <ApprovalsTemplate requests={requests} canApprove={canApprove} />
}
