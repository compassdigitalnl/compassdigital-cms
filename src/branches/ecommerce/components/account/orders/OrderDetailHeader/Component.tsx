import React from 'react'
import Link from 'next/link'
import { RotateCcw, Download } from 'lucide-react'
import { StatusBadge } from '@/branches/ecommerce/components/account/ui'
import { features } from '@/lib/features'
import type { OrderDetailHeaderProps } from './types'

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  return (
    <>
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        <div>
          <Link
            href="/account/orders/"
            className="flex items-center gap-2 text-sm font-semibold mb-3 transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Terug naar bestellingen
          </Link>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-2 text-gray-900">
            Bestelling{' '}
            <span className="font-mono text-xl lg:text-2xl block lg:inline mt-1 lg:mt-0" style={{ color: 'var(--color-primary)' }}>
              {order.orderNumber}
            </span>
          </h1>
          <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
            <span className="text-xs lg:text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-wrap lg:gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            <RotateCcw className="w-4 h-4" />
            Bestel opnieuw
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 bg-gray-50 text-gray-900">
            <Download className="w-4 h-4" />
            Factuur
          </button>
          {features.returns && (
            <Link
              href={`/account/orders/${order.id}/retour`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 bg-gray-50 text-gray-900"
            >
              Retour aanvragen
            </Link>
          )}
        </div>
      </div>

      {/* Mobile action buttons */}
      <div className="grid grid-cols-1 gap-2 lg:hidden">
        <button
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Bestel opnieuw
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 bg-gray-50 text-gray-900">
            <Download className="w-4 h-4" />
            Factuur
          </button>
          {features.returns && (
            <Link
              href={`/account/orders/${order.id}/retour`}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 bg-gray-50 text-gray-900"
            >
              Retour
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
