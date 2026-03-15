'use client'

import React, { useState, useMemo } from 'react'
import { ClipboardCheck } from 'lucide-react'
import {
  ApprovalTabs,
  ApprovalRequestCard,
  BudgetWarningBanner,
} from '@/branches/ecommerce/b2b/components/account/approvals'
import type { ApprovalRequest, ApprovalStatus } from '@/branches/ecommerce/b2b/components/account/approvals/types'

interface ApprovalsTemplateProps {
  requests: ApprovalRequest[]
  canApprove: boolean
}

export default function ApprovalsTemplate({ requests, canApprove }: ApprovalsTemplateProps) {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | 'all'>('all')

  const counts = useMemo(() => {
    const c = { all: requests.length, pending: 0, approved: 0, rejected: 0, expired: 0 }
    requests.forEach((r) => { c[r.status]++ })
    return c
  }, [requests])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return requests
    return requests.filter((r) => r.status === activeTab)
  }, [requests, activeTab])

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const pendingTotal = pendingRequests.reduce((sum, r) => sum + r.totalAmount, 0)

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-navy">Goedkeuringen</h1>
        <p className="text-sm lg:text-base text-grey-mid">
          {canApprove ? 'Beoordeel bestellingen die goedkeuring vereisen' : 'Bekijk de status van je goedkeuringsverzoeken'}
        </p>
      </div>

      {/* Warning banner for approvers */}
      {canApprove && <BudgetWarningBanner pendingCount={pendingRequests.length} pendingTotal={pendingTotal} />}

      {/* Tabs */}
      <ApprovalTabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm text-center">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-grey-mid" />
          <p className="text-sm font-semibold text-grey-mid">Geen goedkeuringsverzoeken</p>
          <p className="text-xs text-grey-mid mt-1">
            {activeTab === 'all'
              ? 'Er zijn nog geen goedkeuringsverzoeken'
              : `Geen ${activeTab === 'pending' ? 'openstaande' : activeTab === 'approved' ? 'goedgekeurde' : 'afgewezen'} verzoeken`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <ApprovalRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
