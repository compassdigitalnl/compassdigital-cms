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

export default function MyAccountTemplate1() {
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
      products: [{ emoji: '🧤', name: 'Nitril handschoenen blauw', sku: 'HAND-012' }],
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
        return { bg: 'var(--color-info-bg)', text: 'var(--color-info)', border: 'rgba(33, 150, 243, 0.4)' }
      case 'delivered':
        return { bg: 'var(--color-success-bg)', text: 'var(--color-success)', border: 'rgba(0, 200, 83, 0.4)' }
      case 'processing':
        return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.4)' }
      default:
        return { bg: 'var(--color-surface)', text: 'var(--color-text-muted)', border: 'var(--color-border)' }
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm lg:text-base text-gray-500">
          Welkom terug! Hier is een overzicht van je account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
              style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
            >
              <Package className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
              {stats.totalOrders}
            </div>
          </div>
          <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
            Totaal bestellingen
          </div>
          <div className="text-xs text-gray-500 mt-1">Sinds account aanmaak</div>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
              style={{ background: 'rgba(0,200,83,0.1)' }}
            >
              <Truck className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-success)' }} />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
              {stats.ordersInTransit}
            </div>
          </div>
          <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
            Onderweg
          </div>
          <div className="text-xs text-gray-500 mt-1">Momenteel in verzending</div>
        </div>

        {/* Order Lists */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              <ClipboardList className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-warning)' }} />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
              {stats.orderLists}
            </div>
          </div>
          <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
            Bestellijsten
          </div>
          <div className="text-xs text-gray-500 mt-1">Opgeslagen lijsten</div>
        </div>

        {/* Yearly Spend */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
              style={{ background: 'rgba(33,150,243,0.1)' }}
            >
              <Euro className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-info)' }} />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
              €{stats.yearlySpend.toLocaleString('nl-NL')}
            </div>
          </div>
          <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
            Dit jaar besteed
          </div>
          <div className="text-xs text-gray-500 mt-1">Totaal 2026</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <h2 className="text-base lg:text-lg font-extrabold mb-3 lg:mb-4 text-gray-900">
          Snelle acties
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <button
            className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
            style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', border: '1.5px solid var(--color-border)' }}
          >
            <div
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-gray-900 mb-0.5">Herhaalbestelling</div>
              <div className="text-xs text-gray-500">Bestel laatste order opnieuw</div>
            </div>
          </button>

          <button
            className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
            style={{ background: 'rgba(0,200,83,0.08)', border: '1.5px solid var(--color-border)' }}
          >
            <div
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-success)' }}
            >
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-gray-900 mb-0.5">Offerte aanvragen</div>
              <div className="text-xs text-gray-500">Voor grote hoeveelheden</div>
            </div>
          </button>

          <button
            className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
            style={{ background: 'rgba(33,150,243,0.08)', border: '1.5px solid var(--color-border)' }}
          >
            <div
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-info)' }}
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-gray-900 mb-0.5">Klantenservice</div>
              <div className="text-xs text-gray-500">Chat of bel ons</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
            Recente bestellingen
          </h2>
          <Link
            href="/my-account/orders/"
            className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            <span className="hidden lg:inline">Alle bestellingen</span>
            <span className="lg:hidden">Alle</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3 lg:space-y-4">
          {recentOrders.map((order) => {
            const statusColors = getStatusColor(order.status)
            return (
              <div
                key={order.id}
                className="p-3 lg:p-4 rounded-xl"
                style={{ border: '1.5px solid var(--color-border)' }}
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-xs lg:text-sm font-bold text-gray-900 font-mono"
                      >
                        {order.orderNumber}
                      </span>
                      <span
                        className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`,
                        }}
                      >
                        {order.statusLabel}
                      </span>
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="text-lg lg:text-xl font-extrabold text-gray-900">
                    €{order.total.toFixed(2)}
                  </div>
                </div>

                {/* Products */}
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                  {order.products.slice(0, 5).map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg flex-shrink-0"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      <span className="text-base lg:text-xl">{product.emoji}</span>
                      <div className="hidden lg:block">
                        <div className="text-xs lg:text-sm font-semibold text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">{product.sku}</div>
                      </div>
                    </div>
                  ))}
                  {order.products.length > 5 && (
                    <div className="px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold bg-gray-100 text-gray-500 flex-shrink-0">
                      +{order.products.length - 5} meer
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/my-account/orders/${order.id}`}
                    className="px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-80"
                    style={{ background: 'var(--color-primary)', color: 'white' }}
                  >
                    Details
                  </Link>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:bg-gray-100 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
                    >
                      Track & trace
                    </a>
                  )}
                  {order.invoiceUrl && (
                    <a
                      href={order.invoiceUrl}
                      className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:bg-gray-100 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
                    >
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <span className="hidden lg:inline">Factuur</span>
                    </a>
                  )}
                  <button className="px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:bg-gray-100 lg:hover:bg-gray-100 bg-gray-50 text-gray-900">
                    <span className="hidden lg:inline">Bestel opnieuw</span>
                    <span className="lg:hidden">Opnieuw</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Lists + Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Order Lists */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-5">
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Bestellijsten</h2>
            <Link
              href="/my-account/lists/"
              className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <span className="hidden lg:inline">Alle lijsten</span>
              <span className="lg:hidden">Alle</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {orderLists.map((list) => (
              <div
                key={list.id}
                className="p-3 lg:p-4 rounded-xl cursor-pointer transition-all active:scale-95 lg:hover:scale-[1.01]"
                style={{ border: '1.5px solid var(--color-border)' }}
              >
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">{list.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {list.productCount} producten
                    </div>
                  </div>
                  <div className="text-base lg:text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    €{list.total.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 lg:gap-2 mb-3">
                  {list.products.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center text-base lg:text-lg bg-gray-50"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>

                <button
                  className="w-full px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:opacity-90 lg:hover:opacity-90 text-white"
                  style={{ background: 'var(--color-primary)' }}
                >
                  Bestel alles
                </button>
              </div>
            ))}

            <Link
              href="/my-account/lists/"
              className="block p-3 lg:p-4 rounded-xl text-center transition-all active:bg-gray-50 lg:hover:bg-gray-50"
              style={{ border: '1.5px dashed var(--color-border)' }}
            >
              <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-primary)' }}>
                + Nieuwe bestellijst
              </div>
              <div className="text-xs text-gray-500">Maak een lijst voor herhaalbestellingen</div>
            </Link>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 lg:mb-5">
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Adressen</h2>
            <Link
              href="/my-account/addresses/"
              className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              Beheer
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-3 lg:p-4 rounded-xl"
                style={{ border: '1.5px solid var(--color-border)' }}
              >
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-bold text-gray-900">{address.typeLabel}</span>
                    {address.isDefault && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        Standaard
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs lg:text-sm text-gray-900 leading-relaxed">
                  <div className="font-semibold">{address.name}</div>
                  <div>{address.street}</div>
                  <div>
                    {address.postalCode} {address.city}
                  </div>
                  <div>{address.country}</div>
                  {address.kvk && (
                    <div className="mt-2 text-gray-500">
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
