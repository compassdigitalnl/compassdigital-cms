'use client'

import React from 'react'
import { RefreshCw, Calendar, Package, Play, Pause, Trash2 } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { RecurringOrderCardProps } from './types'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Actief' }
    case 'paused':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Gepauzeerd' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: status }
  }
}

export function RecurringOrderCard({ order, onTogglePause, onDelete }: RecurringOrderCardProps) {
  const { formatPriceStr, vatLabel } = usePriceMode()
  const statusColors = getStatusColor(order.status)
  const daysUntilNext = order.nextDelivery
    ? Math.ceil((new Date(order.nextDelivery).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold">{order.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                  {statusColors.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{order.frequencyLabel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{order.items?.length || 0} producten</span>
                </div>
              </div>
              {order.status === 'active' && order.nextDelivery && (
                <div className="text-xs text-gray-600">
                  Volgende levering: <span className="font-semibold">{new Date(order.nextDelivery).toLocaleDateString('nl-NL')}</span>
                  {daysUntilNext > 0 && ` (over ${daysUntilNext} dagen)`}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">€{formatPriceStr(order.total)}</div>
            <div className="text-xs text-gray-500">per bestelling ({vatLabel})</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onTogglePause(order.id, order.status)}
          className="btn btn-sm btn-outline-neutral flex items-center gap-2"
        >
          {order.status === 'active' ? (
            <><Pause className="w-4 h-4" /> Pauzeren</>
          ) : (
            <><Play className="w-4 h-4" /> Hervatten</>
          )}
        </button>
        <button
          onClick={() => onDelete(order.id)}
          className="btn btn-sm btn-danger flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Verwijderen
        </button>
      </div>
    </div>
  )
}
