'use client'

import React from 'react'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { features } from '@/lib/tenant/features'
import { StatusBadge } from '@/branches/ecommerce/shared/components/account/ui'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { formatOrderStatus } from '@/branches/ecommerce/shared/lib/formatOrderStatus'
import type { RecentOrdersProps } from './types'

export function RecentOrders({ orders }: RecentOrdersProps) {
  const { formatPriceStr, vatLabel } = usePriceMode()

  if (!features.checkout || orders.length === 0) return null

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 lg:mb-5">
        <h2 className="text-base lg:text-lg font-extrabold text-navy">
          Recente bestellingen
        </h2>
        <Link
          href="/account/orders"
          className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          <span className="hidden lg:inline">Alle bestellingen</span>
          <span className="lg:hidden">Alle</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-3 lg:p-4 rounded-xl"
            style={{ border: '1.5px solid var(--color-border)' }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs lg:text-sm font-bold text-navy font-mono">
                    {order.orderNumber}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-xs lg:text-sm text-grey-mid">
                  {new Date(order.date).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div className="text-lg lg:text-xl font-extrabold text-navy">
                €{formatPriceStr(order.total)}
                <span className="block text-xs font-normal text-grey-mid">{vatLabel}</span>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                {order.items.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg flex-shrink-0"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    <Package className="w-4 h-4 text-grey-mid" />
                    <div className="hidden lg:block">
                      <div className="text-xs lg:text-sm font-semibold text-navy">
                        {item.title}
                      </div>
                      {item.sku && (
                        <div className="text-xs text-grey-mid font-mono">{item.sku}</div>
                      )}
                    </div>
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold bg-grey-light text-grey-mid flex-shrink-0">
                    +{order.items.length - 5} meer
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/account/orders/${order.id}`}
                className="btn btn-primary btn-sm"
              >
                Details
              </Link>
              {order.trackingUrl && features.orderTracking && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Track & trace
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
