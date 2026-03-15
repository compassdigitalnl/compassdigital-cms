'use client'

import React from 'react'
import { StatusBadge } from '@/branches/ecommerce/shared/components/account/ui'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { formatPaymentStatus } from '@/branches/ecommerce/shared/lib/formatOrderStatus'
import type { OrderSummaryCardProps } from './types'

const paymentMethodLabels: Record<string, string> = {
  ideal: 'iDEAL',
  invoice: 'Op rekening',
  creditcard: 'Creditcard',
  banktransfer: 'Bankoverschrijving',
}

export function OrderSummaryCard({ order, onReorder }: OrderSummaryCardProps) {
  const { formatPriceStr, vatLabel } = usePriceMode()
  const paymentInfo = formatPaymentStatus(order.paymentStatus)

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm lg:sticky lg:top-8">
      <h2 className="text-base lg:text-lg font-extrabold mb-4 lg:mb-5 text-navy">
        Bestelling overzicht
      </h2>

      <div className="space-y-2 lg:space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-sm text-grey-mid">Subtotaal</span>
          <span className="text-xs lg:text-sm font-semibold text-navy">€{formatPriceStr(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-sm text-grey-mid">Verzendkosten</span>
          <span className="text-xs lg:text-sm font-semibold text-navy">
            {order.shippingCost === 0 ? <span className="text-green">Gratis</span> : `€${formatPriceStr(order.shippingCost)}`}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs lg:text-sm text-grey-mid">Korting</span>
            <span className="text-xs lg:text-sm font-semibold text-green">-€{formatPriceStr(order.discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-sm text-grey-mid">BTW</span>
          <span className="text-xs lg:text-sm font-semibold text-navy">€{formatPriceStr(order.tax)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 lg:pt-4 mb-4 lg:mb-5 border-t-2 border-grey-light">
        <span className="text-base lg:text-lg font-extrabold text-navy">Totaal ({vatLabel})</span>
        <span className="text-xl lg:text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>€{formatPriceStr(order.total)}</span>
      </div>

      <div className="space-y-1.5 lg:space-y-2 mb-4 lg:mb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-grey-mid">Betaalmethode</span>
          <span className="text-xs font-semibold text-navy">
            {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-grey-mid">Betaalstatus</span>
          <StatusBadge status={order.paymentStatus} statusInfo={paymentInfo} />
        </div>
      </div>

      <button
        onClick={onReorder}
        className="btn btn-primary w-full mb-2"
      >
        Bestel opnieuw
      </button>
    </div>
  )
}
