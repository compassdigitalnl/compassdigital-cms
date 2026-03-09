'use client'

import React from 'react'
import { CheckCircle2, Clock, Package, MapPin, CreditCard } from 'lucide-react'
import { buildOrderTimeline } from '@/branches/ecommerce/shared/lib/buildOrderTimeline'
import { OrderDetailHeader, TrackingBanner, OrderSummaryCard } from '@/branches/ecommerce/shared/components/account/orders'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { OrderDetailTemplateProps } from './types'

export default function OrderDetailTemplate({ order, onReorder, onDownloadInvoice }: OrderDetailTemplateProps) {
  const { formatPriceStr } = usePriceMode()
  const timeline = buildOrderTimeline(order.status, order.timeline)
  const shippingAddr = order.shippingAddress
  const billingAddr = order.billingAddress
  const useSameAddress = billingAddr?.sameAsShipping !== false

  return (
    <div className="space-y-4 lg:space-y-6">
      <OrderDetailHeader order={order} onReorder={onReorder} onDownloadInvoice={onDownloadInvoice} />

      {order.trackingUrl && (
        <TrackingBanner trackingUrl={order.trackingUrl} trackingCode={order.trackingCode} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="space-y-4 lg:space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
            <h2 className="text-base lg:text-lg font-extrabold mb-4 lg:mb-5 text-gray-900">
              Status tijdlijn
            </h2>
            <div className="space-y-3 lg:space-y-4">
              {timeline.map((step, idx) => {
                const isLast = idx === timeline.length - 1
                const Icon = step.completed ? CheckCircle2 : Clock
                return (
                  <div key={step.status + idx} className="flex gap-3 lg:gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed ? '' : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                        style={step.completed ? { background: 'var(--color-primary)' } : undefined}
                      >
                        <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${step.completed ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 my-1.5 lg:my-2 ${step.completed ? '' : 'bg-gray-200'}`}
                          style={{ minHeight: '20px', ...(step.completed ? { background: 'var(--color-primary)' } : {}) }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4 lg:pb-6">
                      <div className={`text-xs lg:text-sm font-bold mb-0.5 lg:mb-1 ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      {step.date && (
                        <div className="text-xs text-gray-500">
                          {new Date(step.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                      {!step.date && !step.completed && (
                        <div className="text-xs text-gray-500">Verwacht binnenkort</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
            <h2 className="text-base lg:text-lg font-extrabold mb-4 lg:mb-5 text-gray-900">
              Bestelde producten
            </h2>
            <div className="space-y-2 lg:space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50">
                    <Package className="w-6 h-6 lg:w-8 lg:h-8 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs lg:text-sm font-bold mb-1 text-gray-900">{item.title}</div>
                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                      {item.sku && <span className="text-xs font-mono text-gray-500">SKU: {item.sku}</span>}
                      {item.ean && <span className="hidden lg:inline text-xs font-mono text-gray-500">EAN: {item.ean}</span>}
                    </div>
                    <div className="mt-1.5 lg:mt-2 flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-900">
                      <span>Aantal: <span className="font-bold">{item.quantity}x</span></span>
                      <span>Prijs: <span className="font-bold">€{formatPriceStr(item.price)}</span></span>
                    </div>
                  </div>
                  <div className="text-sm lg:text-base font-extrabold text-gray-900 flex-shrink-0">
                    €{formatPriceStr(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-sm lg:text-base font-extrabold text-gray-900">Bezorgadres</h3>
              </div>
              <div className="text-xs lg:text-sm text-gray-900 leading-relaxed">
                {shippingAddr.company && <div className="font-semibold">{shippingAddr.company}</div>}
                <div>{shippingAddr.firstName} {shippingAddr.lastName}</div>
                <div>{shippingAddr.street} {shippingAddr.houseNumber}{shippingAddr.addition ? ` ${shippingAddr.addition}` : ''}</div>
                <div>{shippingAddr.postalCode} {shippingAddr.city}</div>
                {shippingAddr.country && <div>{shippingAddr.country}</div>}
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-sm lg:text-base font-extrabold text-gray-900">Factuuradres</h3>
              </div>
              <div className="text-xs lg:text-sm text-gray-900 leading-relaxed">
                {useSameAddress ? (
                  <div className="text-gray-500 italic">Zelfde als bezorgadres</div>
                ) : (
                  <>
                    {billingAddr.company && <div className="font-semibold">{billingAddr.company}</div>}
                    <div>{billingAddr.firstName} {billingAddr.lastName}</div>
                    <div>{billingAddr.street} {billingAddr.houseNumber}{billingAddr.addition ? ` ${billingAddr.addition}` : ''}</div>
                    <div>{billingAddr.postalCode} {billingAddr.city}</div>
                    {billingAddr.country && <div>{billingAddr.country}</div>}
                    {(billingAddr.kvk || billingAddr.vatNumber) && (
                      <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-200">
                        {billingAddr.kvk && <div className="text-gray-500">KVK: {billingAddr.kvk}</div>}
                        {billingAddr.vatNumber && <div className="text-gray-500">BTW: {billingAddr.vatNumber}</div>}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          <OrderSummaryCard order={order} onReorder={onReorder} />
        </div>
      </div>
    </div>
  )
}
