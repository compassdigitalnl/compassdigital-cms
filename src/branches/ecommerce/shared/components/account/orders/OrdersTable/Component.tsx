'use client'

import React from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { StatusBadge } from '@/branches/ecommerce/shared/components/account/ui'
import type { OrdersTableProps } from './types'

export function OrdersTable({ orders }: OrdersTableProps) {
  const { formatPriceStr } = usePriceMode()
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-grey-light border-b border-grey-light">
          <tr>
            <th className="text-left px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Bestelnummer</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Datum</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Producten</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Status</th>
            <th className="text-right px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Totaal</th>
            <th className="text-right px-6 py-4 text-xs font-bold text-grey-mid uppercase tracking-wide">Acties</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-grey-light last:border-0 hover:bg-grey-light transition-colors">
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-navy font-mono">{order.orderNumber}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-navy">
                  {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-grey-mid" />
                  <span className="text-sm text-navy">
                    {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'product' : 'producten'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-navy">€{formatPriceStr(order.total)}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="btn btn-primary btn-sm inline-block"
                >
                  Bekijk
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
