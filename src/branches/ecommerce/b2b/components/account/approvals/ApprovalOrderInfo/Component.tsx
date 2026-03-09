'use client'

import React from 'react'
import { FileText, User, Calendar, MapPin } from 'lucide-react'
import { REASON_LABELS } from '../types'
import type { ApprovalOrderInfoProps } from './types'

export function ApprovalOrderInfo({ request }: ApprovalOrderInfoProps) {
  const dateStr = new Date(request.createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Orderdetails</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Referentie</div>
            <div className="text-sm font-semibold text-gray-900">#{request.orderReference}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Aangevraagd door</div>
            <div className="text-sm font-semibold text-gray-900">{request.requestedBy.name}</div>
            <div className="text-xs text-gray-400">{request.requestedBy.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Aangevraagd op</div>
            <div className="text-sm font-semibold text-gray-900">{dateStr}</div>
          </div>
        </div>

        {request.reason && (
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Reden</div>
              <div className="text-sm font-semibold text-gray-900">{REASON_LABELS[request.reason]}</div>
            </div>
          </div>
        )}

        {request.note && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Opmerking aanvrager</div>
            <div className="text-sm text-gray-700">{request.note}</div>
          </div>
        )}
      </div>
    </div>
  )
}
