'use client'

import React from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import { StatusBadge } from '@/branches/ecommerce/components/account/ui'
import type { OrderCardMobileProps } from './types'

export function OrderCardMobile({ order }: OrderCardMobileProps) {
  const { formatPriceStr } = usePriceMode()
  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-gray-900 font-mono block mb-0.5">{order.orderNumber}</span>
          <span className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <span className="text-base font-bold text-gray-900 flex-shrink-0 ml-2">€{formatPriceStr(order.total)}</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-900">
            {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'product' : 'producten'}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <Link
        href={`/account/orders/${order.id}`}
        className="btn btn-primary block w-full text-center"
      >
        Bekijk details
      </Link>
    </div>
  )
}
