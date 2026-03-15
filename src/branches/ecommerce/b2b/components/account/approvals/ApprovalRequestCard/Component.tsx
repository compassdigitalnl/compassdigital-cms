'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, User, Euro, Package } from 'lucide-react'
import { REASON_LABELS } from '../types'
import { ApprovalStatusBadge } from '../ApprovalStatusBadge'
import type { ApprovalRequestCardProps } from './types'

export function ApprovalRequestCard({ request }: ApprovalRequestCardProps) {
  const dateStr = new Date(request.createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link
      href={`/account/approvals/${request.id}`}
      className="block bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-navy">#{request.orderReference}</span>
            <ApprovalStatusBadge status={request.status} />
          </div>
          <span className="text-xs text-grey-mid">{dateStr}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-grey-mid flex-shrink-0" />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-grey-mid">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          {request.requestedBy.name}
        </span>
        <span className="flex items-center gap-1.5">
          <Euro className="w-3.5 h-3.5" />
          {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(request.totalAmount)}
        </span>
        <span className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          {request.items?.length || 0} product{(request.items?.length || 0) !== 1 ? 'en' : ''}
        </span>
      </div>

      {request.reason && (
        <div className="mt-2 text-xs text-grey-mid">
          {REASON_LABELS[request.reason]}
        </div>
      )}
    </Link>
  )
}
