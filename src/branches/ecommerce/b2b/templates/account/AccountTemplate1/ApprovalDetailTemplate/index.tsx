'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  ApprovalStatusBadge,
  ApprovalProductsTable,
  ApprovalTimeline,
  ApprovalActionBar,
  ApprovalOrderInfo,
  BudgetStatusCard,
} from '@/branches/ecommerce/b2b/components/account/approvals'
import type { ApprovalRequest, ApprovalTimelineEvent } from '@/branches/ecommerce/b2b/components/account/approvals/types'

interface ApprovalDetailTemplateProps {
  request: ApprovalRequest
  timeline: ApprovalTimelineEvent[]
  canApprove: boolean
  monthlyBudget?: number
  monthlyUsed: number
  onApprove: (note?: string) => Promise<void>
  onReject: (note?: string) => Promise<void>
  isSubmitting: boolean
}

export default function ApprovalDetailTemplate({
  request,
  timeline,
  canApprove,
  monthlyBudget,
  monthlyUsed,
  onApprove,
  onReject,
  isSubmitting,
}: ApprovalDetailTemplateProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href="/account/approvals"
          className="inline-flex items-center gap-1 text-sm text-grey-mid hover:text-grey-dark mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Terug naar overzicht
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-navy">
            #{request.orderReference}
          </h1>
          <ApprovalStatusBadge status={request.status} size="md" />
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6">
        {/* Left: Products + Timeline */}
        <div className="space-y-4 lg:space-y-6">
          <ApprovalProductsTable items={request.items || []} totalAmount={request.totalAmount} />
          <ApprovalTimeline events={timeline} />
        </div>

        {/* Right: Actions + Order Info + Budget */}
        <div className="space-y-4 lg:space-y-6">
          {canApprove && request.status === 'pending' && (
            <ApprovalActionBar
              onApprove={onApprove}
              onReject={onReject}
              isSubmitting={isSubmitting}
            />
          )}
          <ApprovalOrderInfo request={request} />
          <BudgetStatusCard
            monthlyBudget={monthlyBudget}
            monthlyUsed={monthlyUsed}
            orderAmount={request.totalAmount}
          />
        </div>
      </div>
    </div>
  )
}
