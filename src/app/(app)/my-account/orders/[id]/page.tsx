'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft,
  Download,
  RotateCcw,
  Printer,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
} from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params?.id

  // TODO: Replace with real data from API based on orderId
  const order = {
    id: orderId,
    orderNumber: 'ORD-20260218-00142',
    date: '2026-02-18T14:23:00',
    status: 'shipped',
    statusLabel: 'Onderweg',
    paymentMethod: 'iDEAL',
    paymentStatus: 'Betaald',
    trackingNumber: '3SABCD1234567890',
    trackingUrl: 'https://postnl.nl/track/3SABCD1234567890',
    items: [
      {
        id: '1',
        emoji: '🧤',
        name: 'Latex handschoenen - Poedervrij - Maat L',
        sku: 'HAND-001',
        ean: '8719327001234',
        quantity: 10,
        price: 12.95,
        subtotal: 129.5,
      },
      {
        id: '2',
        emoji: '🗑️',
        name: 'Afvalbak met pedaal - RVS - 30L',
        sku: 'BIN-023',
        ean: '8719327002345',
        quantity: 2,
        price: 45.99,
        subtotal: 91.98,
      },
      {
        id: '3',
        emoji: '🧴',
        name: 'Handgel dispenser - Automatisch - Wit',
        sku: 'DISP-112',
        ean: '8719327003456',
        quantity: 1,
        price: 24.0,
        subtotal: 24.0,
      },
    ],
    shippingAddress: {
      name: 'Plastimed B.V.',
      contactPerson: 'Jan de Vries',
      street: 'Parallelweg 124',
      postalCode: '1948 NN',
      city: 'Beverwijk',
      country: 'Nederland',
    },
    billingAddress: {
      name: 'Plastimed B.V.',
      street: 'Parallelweg 124',
      postalCode: '1948 NN',
      city: 'Beverwijk',
      country: 'Nederland',
      kvk: '12345678',
      vat: 'NL123456789B01',
    },
    timeline: [
      {
        status: 'ordered',
        label: 'Bestelling geplaatst',
        date: '2026-02-18T14:23:00',
        completed: true,
      },
      {
        status: 'paid',
        label: 'Betaling ontvangen',
        date: '2026-02-18T14:25:00',
        completed: true,
      },
      {
        status: 'processing',
        label: 'In behandeling',
        date: '2026-02-18T16:30:00',
        completed: true,
      },
      {
        status: 'shipped',
        label: 'Verzonden',
        date: '2026-02-19T09:15:00',
        completed: true,
      },
      { status: 'delivered', label: 'Afgeleverd', date: null, completed: false },
    ],
    subtotal: 245.48,
    shipping: 0,
    tax: 51.55,
    total: 297.03,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped':
        return { bg: '#E3F2FD', text: '#2196F3', border: '#90CAF9' }
      case 'delivered':
        return { bg: '#E8F5E9', text: '#00C853', border: '#A5D6A7' }
      case 'processing':
        return { bg: '#FFF8E1', text: '#F59E0B', border: '#FFE082' }
      default:
        return { bg: '#F5F7FA', text: '#94A3B8', border: '#E8ECF1' }
    }
  }

  const statusColors = getStatusColor(order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/my-account/orders"
            className="flex items-center gap-2 font-semibold mb-3 transition-colors"
            style={{ fontSize: '14px', color: '#00897B' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Terug naar bestellingen
          </Link>
          <h1
            className="font-extrabold mb-2"
            style={{
              fontSize: '28px',
              color: '#0A1628',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Bestelling{' '}
            <span
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', color: '#00897B' }}
            >
              {order.orderNumber}
            </span>
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span style={{ fontSize: '14px', color: '#94A3B8' }}>
              {new Date(order.date).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span
              className="px-3 py-1 rounded-full font-semibold"
              style={{
                background: statusColors.bg,
                color: statusColors.text,
                fontSize: '13px',
                border: `1px solid ${statusColors.border}`,
              }}
            >
              {order.statusLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
          >
            <RotateCcw className="w-4 h-4" />
            Bestel opnieuw
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
            style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
          >
            <Download className="w-4 h-4" />
            Factuur
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
            style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Track & Trace Banner */}
      {order.trackingUrl && (
        <a
          href={order.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-2xl p-5 shadow-sm transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(33,150,243,0.1)' }}
            >
              <Truck className="w-6 h-6" style={{ color: '#2196F3' }} />
            </div>
            <div className="flex-1">
              <div className="font-bold mb-1" style={{ fontSize: '15px', color: '#0A1628' }}>
                Track & trace je bestelling
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                Trackingnummer:{' '}
                <span
                  className="font-mono"
                  style={{ color: '#0A1628', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {order.trackingNumber}
                </span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 rotate-180" style={{ color: '#2196F3' }} />
          </div>
        </a>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2
              className="font-extrabold mb-5"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Status tijdlijn
            </h2>

            <div className="space-y-4">
              {order.timeline.map((step, idx) => {
                const isLast = idx === order.timeline.length - 1
                const Icon = step.completed ? CheckCircle2 : Clock
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed ? 'bg-gradient-to-br' : ''
                        }`}
                        style={{
                          background: step.completed
                            ? 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'
                            : '#F5F7FA',
                          border: step.completed ? 'none' : '2px solid #E8ECF1',
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: step.completed ? 'white' : '#94A3B8' }}
                        />
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 my-2"
                          style={{
                            background: step.completed ? '#00897B' : '#E8ECF1',
                            minHeight: '24px',
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div
                        className="font-bold mb-1"
                        style={{
                          fontSize: '14px',
                          color: step.completed ? '#0A1628' : '#94A3B8',
                        }}
                      >
                        {step.label}
                      </div>
                      {step.date && (
                        <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                          {new Date(step.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                      {!step.date && !step.completed && (
                        <div style={{ fontSize: '13px', color: '#94A3B8' }}>Verwacht binnenkort</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2
              className="font-extrabold mb-5"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Bestelde producten
            </h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ border: '1.5px solid #E8ECF1' }}
                >
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F5F7FA', fontSize: '32px' }}
                  >
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold mb-1" style={{ fontSize: '14px', color: '#0A1628' }}>
                      {item.name}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#94A3B8',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        SKU: {item.sku}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#94A3B8',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        EAN: {item.ean}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <span style={{ fontSize: '13px', color: '#0A1628' }}>
                        Aantal: <span className="font-bold">{item.quantity}x</span>
                      </span>
                      <span style={{ fontSize: '13px', color: '#0A1628' }}>
                        Prijs: <span className="font-bold">€{item.price.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: '16px',
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    €{item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" style={{ color: '#00897B' }} />
                <h3
                  className="font-extrabold"
                  style={{
                    fontSize: '16px',
                    color: '#0A1628',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  Bezorgadres
                </h3>
              </div>
              <div style={{ fontSize: '13px', color: '#0A1628', lineHeight: '1.6' }}>
                <div className="font-semibold">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.contactPerson}</div>
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" style={{ color: '#00897B' }} />
                <h3
                  className="font-extrabold"
                  style={{
                    fontSize: '16px',
                    color: '#0A1628',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  Factuuradres
                </h3>
              </div>
              <div style={{ fontSize: '13px', color: '#0A1628', lineHeight: '1.6' }}>
                <div className="font-semibold">{order.billingAddress.name}</div>
                <div>{order.billingAddress.street}</div>
                <div>
                  {order.billingAddress.postalCode} {order.billingAddress.city}
                </div>
                <div>{order.billingAddress.country}</div>
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E8ECF1' }}>
                  <div style={{ color: '#94A3B8' }}>KVK: {order.billingAddress.kvk}</div>
                  <div style={{ color: '#94A3B8' }}>BTW: {order.billingAddress.vat}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
            <h2
              className="font-extrabold mb-5"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Bestelling overzicht
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#94A3B8' }}>Subtotaal</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
                  €{order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#94A3B8' }}>Verzendkosten</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
                  {order.shipping === 0 ? (
                    <span style={{ color: '#00C853' }}>Gratis</span>
                  ) : (
                    `€${order.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#94A3B8' }}>BTW (21%)</span>
                <span className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
                  €{order.tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div
              className="flex items-center justify-between pt-4 mb-5"
              style={{ borderTop: '2px solid #E8ECF1' }}
            >
              <span
                className="font-extrabold"
                style={{
                  fontSize: '18px',
                  color: '#0A1628',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                Totaal
              </span>
              <span
                className="font-extrabold"
                style={{
                  fontSize: '24px',
                  color: '#00897B',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                €{order.total.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Betaalmethode</span>
                <span className="font-semibold" style={{ fontSize: '13px', color: '#0A1628' }}>
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Betaalstatus</span>
                <span
                  className="px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: 'rgba(0,200,83,0.1)',
                    color: '#00C853',
                    fontSize: '12px',
                  }}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <button
              className="w-full px-4 py-3 rounded-xl font-bold transition-all hover:opacity-90 mb-2"
              style={{
                background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
                color: 'white',
                fontSize: '14px',
              }}
            >
              Bestel opnieuw
            </button>

            <button
              className="w-full px-4 py-3 rounded-xl font-semibold transition-all hover:bg-gray-100"
              style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
            >
              Download factuur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
