import React from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { StatusBadge } from '@/branches/ecommerce/components/account/ui'
import type { OrdersTableProps } from './types'

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Bestelnummer</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Datum</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Producten</th>
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Totaal</th>
            <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Acties</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-gray-900 font-mono">{order.orderNumber}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'product' : 'producten'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-900">€{order.total.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80 text-white"
                  style={{ background: 'var(--color-primary)' }}
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
