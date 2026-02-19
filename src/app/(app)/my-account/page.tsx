'use client'

import React from 'react'
import Link from 'next/link'
import {
  Package,
  Truck,
  ClipboardList,
  Euro,
  RotateCcw,
  FileText,
  MessageCircle,
  ChevronRight,
  Download,
  MapPin,
} from 'lucide-react'

export default function MyAccountDashboard() {
  // TODO: Replace with real data from API
  const stats = {
    totalOrders: 47,
    ordersInTransit: 2,
    orderLists: 3,
    yearlySpend: 18450.0,
  }

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-20260218-00142',
      date: '2026-02-18',
      products: [
        { emoji: '🧤', name: 'Latex handschoenen', sku: 'HAND-001' },
        { emoji: '🗑️', name: 'Afvalbak pedaal', sku: 'BIN-023' },
      ],
      status: 'shipped',
      statusLabel: 'Onderweg',
      total: 245.5,
      trackingUrl: 'https://postnl.nl/track/3SABCD...',
      invoiceUrl: '/invoices/142.pdf',
    },
    {
      id: '2',
      orderNumber: 'ORD-20260215-00138',
      date: '2026-02-15',
      products: [
        { emoji: '🧴', name: 'Handgel dispenser', sku: 'DISP-112' },
        { emoji: '🧻', name: 'Papieren handdoekjes', sku: 'PAPER-045' },
        { emoji: '🧼', name: 'Zeep navulling', sku: 'SOAP-078' },
      ],
      status: 'delivered',
      statusLabel: 'Afgeleverd',
      total: 189.9,
      trackingUrl: null,
      invoiceUrl: '/invoices/138.pdf',
    },
    {
      id: '3',
      orderNumber: 'ORD-20260210-00129',
      date: '2026-02-10',
      products: [
        { emoji: '🧤', name: 'Nitril handschoenen blauw', sku: 'HAND-012' },
      ],
      status: 'processing',
      statusLabel: 'In behandeling',
      total: 124.95,
      trackingUrl: null,
      invoiceUrl: null,
    },
  ]

  const orderLists = [
    {
      id: '1',
      name: 'Maandelijkse voorraad',
      productCount: 8,
      products: ['🧤', '🧴', '🗑️', '🧻', '🧼'],
      total: 456.8,
    },
    {
      id: '2',
      name: 'Examenruimte benodigdheden',
      productCount: 5,
      products: ['🧤', '🧴', '🗑️', '🧻'],
      total: 234.5,
    },
  ]

  const addresses = [
    {
      id: '1',
      type: 'shipping',
      typeLabel: 'Bezorgadres',
      isDefault: true,
      name: 'Plastimed B.V.',
      street: 'Parallelweg 124',
      postalCode: '1948 NN',
      city: 'Beverwijk',
      country: 'Nederland',
    },
    {
      id: '2',
      type: 'billing',
      typeLabel: 'Factuuradres',
      isDefault: false,
      name: 'Plastimed B.V.',
      street: 'Parallelweg 124',
      postalCode: '1948 NN',
      city: 'Beverwijk',
      country: 'Nederland',
      kvk: '12345678',
      vat: 'NL123456789B01',
    },
  ]

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1
          className="font-extrabold mb-2"
          style={{
            fontSize: '28px',
            color: '#0A1628',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#94A3B8' }}>
          Welkom terug! Hier is een overzicht van je account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,137,123,0.1)' }}
            >
              <Package className="w-5 h-5" style={{ color: '#00897B' }} />
            </div>
            <div
              className="font-extrabold"
              style={{
                fontSize: '24px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {stats.totalOrders}
            </div>
          </div>
          <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
            Totaal bestellingen
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Sinds account aanmaak
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,200,83,0.1)' }}
            >
              <Truck className="w-5 h-5" style={{ color: '#00C853' }} />
            </div>
            <div
              className="font-extrabold"
              style={{
                fontSize: '24px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {stats.ordersInTransit}
            </div>
          </div>
          <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
            Onderweg
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Momenteel in verzending
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              <ClipboardList className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <div
              className="font-extrabold"
              style={{
                fontSize: '24px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {stats.orderLists}
            </div>
          </div>
          <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
            Bestellijsten
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Opgeslagen lijsten
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(33,150,243,0.1)' }}
            >
              <Euro className="w-5 h-5" style={{ color: '#2196F3' }} />
            </div>
            <div
              className="font-extrabold"
              style={{
                fontSize: '24px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              €{stats.yearlySpend.toLocaleString('nl-NL')}
            </div>
          </div>
          <div className="font-semibold" style={{ fontSize: '14px', color: '#0A1628' }}>
            Dit jaar besteed
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Totaal 2026
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2
          className="font-extrabold mb-4"
          style={{
            fontSize: '18px',
            color: '#0A1628',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          Snelle acties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(0,137,123,0.08)', border: '1.5px solid #E8ECF1' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#00897B' }}
            >
              <RotateCcw className="w-5 h-5" style={{ color: 'white' }} />
            </div>
            <div className="flex-1 text-left">
              <div
                className="font-bold"
                style={{ fontSize: '14px', color: '#0A1628', marginBottom: '2px' }}
              >
                Herhaalbestelling
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Bestel laatste order opnieuw</div>
            </div>
          </button>

          <button
            className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(0,200,83,0.08)', border: '1.5px solid #E8ECF1' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#00C853' }}
            >
              <FileText className="w-5 h-5" style={{ color: 'white' }} />
            </div>
            <div className="flex-1 text-left">
              <div
                className="font-bold"
                style={{ fontSize: '14px', color: '#0A1628', marginBottom: '2px' }}
              >
                Offerte aanvragen
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Voor grote hoeveelheden</div>
            </div>
          </button>

          <button
            className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(33,150,243,0.08)', border: '1.5px solid #E8ECF1' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#2196F3' }}
            >
              <MessageCircle className="w-5 h-5" style={{ color: 'white' }} />
            </div>
            <div className="flex-1 text-left">
              <div
                className="font-bold"
                style={{ fontSize: '14px', color: '#0A1628', marginBottom: '2px' }}
              >
                Klantenservice
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Chat of bel ons</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-extrabold"
            style={{
              fontSize: '18px',
              color: '#0A1628',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Recente bestellingen
          </h2>
          <Link
            href="/my-account/orders"
            className="flex items-center gap-2 font-semibold transition-colors"
            style={{ fontSize: '14px', color: '#00897B' }}
          >
            Alle bestellingen
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => {
            const statusColors = getStatusColor(order.status)
            return (
              <div
                key={order.id}
                className="p-4 rounded-xl"
                style={{ border: '1.5px solid #E8ECF1' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="font-bold"
                          style={{
                            fontSize: '14px',
                            color: '#0A1628',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          {order.orderNumber}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full font-semibold"
                          style={{
                            background: statusColors.bg,
                            color: statusColors.text,
                            fontSize: '12px',
                            border: `1px solid ${statusColors.border}`,
                          }}
                        >
                          {order.statusLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                        {new Date(order.date).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: '18px',
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    €{order.total.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {order.products.slice(0, 5).map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: '#F5F7FA' }}
                    >
                      <span style={{ fontSize: '20px' }}>{product.emoji}</span>
                      <div className="hidden sm:block">
                        <div
                          className="font-semibold"
                          style={{ fontSize: '13px', color: '#0A1628' }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#94A3B8',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          {product.sku}
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.products.length > 5 && (
                    <div
                      className="px-3 py-2 rounded-lg font-semibold"
                      style={{ background: '#F5F7FA', fontSize: '13px', color: '#94A3B8' }}
                    >
                      +{order.products.length - 5} meer
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/my-account/orders/${order.id}`}
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                    style={{ background: '#00897B', color: 'white', fontSize: '13px' }}
                  >
                    Bekijk details
                  </Link>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-100"
                      style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '13px' }}
                    >
                      Track & trace
                    </a>
                  )}
                  {order.invoiceUrl && (
                    <a
                      href={order.invoiceUrl}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-100"
                      style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '13px' }}
                    >
                      <Download className="w-4 h-4" />
                      Factuur
                    </a>
                  )}
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-100"
                    style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '13px' }}
                  >
                    Bestel opnieuw
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Lists + Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Lists */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Bestellijsten
            </h2>
            <Link
              href="/my-account/lists"
              className="flex items-center gap-2 font-semibold transition-colors"
              style={{ fontSize: '14px', color: '#00897B' }}
            >
              Alle lijsten
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {orderLists.map((list) => (
              <div
                key={list.id}
                className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{ border: '1.5px solid #E8ECF1' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-bold" style={{ fontSize: '14px', color: '#0A1628' }}>
                      {list.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                      {list.productCount} producten
                    </div>
                  </div>
                  <div
                    className="font-bold"
                    style={{
                      fontSize: '16px',
                      color: '#00897B',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    €{list.total.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {list.products.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: '#F5F7FA', fontSize: '18px' }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>

                <button
                  className="w-full px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: '#00897B', color: 'white', fontSize: '13px' }}
                >
                  Bestel alles
                </button>
              </div>
            ))}

            <Link
              href="/my-account/lists"
              className="block p-4 rounded-xl text-center transition-all hover:bg-gray-50"
              style={{ border: '1.5px dashed #E8ECF1' }}
            >
              <div
                className="font-semibold"
                style={{ fontSize: '14px', color: '#00897B', marginBottom: '2px' }}
              >
                + Nieuwe bestellijst
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                Maak een lijst voor herhaalbestellingen
              </div>
            </Link>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Adressen
            </h2>
            <Link
              href="/my-account/addresses"
              className="flex items-center gap-2 font-semibold transition-colors"
              style={{ fontSize: '14px', color: '#00897B' }}
            >
              Beheer
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 rounded-xl"
                style={{ border: '1.5px solid #E8ECF1' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#00897B' }} />
                    <span className="font-bold" style={{ fontSize: '14px', color: '#0A1628' }}>
                      {address.typeLabel}
                    </span>
                    {address.isDefault && (
                      <span
                        className="px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: 'rgba(0,137,123,0.1)',
                          color: '#00897B',
                          fontSize: '11px',
                        }}
                      >
                        Standaard
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#0A1628', lineHeight: '1.6' }}>
                  <div className="font-semibold">{address.name}</div>
                  <div>{address.street}</div>
                  <div>
                    {address.postalCode} {address.city}
                  </div>
                  <div>{address.country}</div>
                  {address.kvk && (
                    <div style={{ marginTop: '8px', color: '#94A3B8' }}>
                      <div>KVK: {address.kvk}</div>
                      <div>BTW: {address.vat}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
