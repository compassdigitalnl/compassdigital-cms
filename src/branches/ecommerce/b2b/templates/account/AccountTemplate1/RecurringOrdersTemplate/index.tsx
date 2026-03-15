'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { AccountEmptyState, AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import { RecurringOrderCard } from '@/branches/ecommerce/b2b/components/account/recurring-orders'
import type { RecurringOrdersTemplateProps } from './types'

export default function RecurringOrdersTemplate({
  recurringOrders,
  onTogglePause,
  onDelete,
  isLoading,
}: RecurringOrdersTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">Terugkerende Bestellingen</h1>
        <p className="text-sm lg:text-base text-gray-500">Beheer je automatische bestellingen en bezorgfrequentie</p>
      </div>

      {recurringOrders.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-teal" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-navy mb-1">Automatische bestellingen</h3>
              <p className="text-xs text-teal-700">
                Je terugkerende bestellingen worden automatisch verwerkt op de ingestelde datum.
                Je ontvangt 3 dagen van tevoren een herinneringsmail.
              </p>
            </div>
          </div>
        </div>
      )}

      {recurringOrders.length > 0 ? (
        <div className="space-y-4">
          {recurringOrders.map((order) => (
            <RecurringOrderCard
              key={order.id}
              order={order}
              onTogglePause={onTogglePause}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <AccountEmptyState
          icon={RefreshCw}
          title="Geen terugkerende bestellingen"
          description="Stel een terugkerende bestelling in voor producten die je regelmatig nodig hebt."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      )}
    </div>
  )
}
