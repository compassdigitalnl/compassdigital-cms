'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { features } from '@/lib/features'
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
  CreditCard,
  KeyRound,
  Gift,
  Award,
  Heart,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react'

type TabKey = 'dashboard' | 'orders' | 'subscriptions' | 'licenses' | 'gift-vouchers' | 'loyalty' | 'invoices' | 'order-lists' | 'recurring-orders' | 'favorites' | 'addresses'

export default function MyAccountTemplate1() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')

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

  // Define all possible tabs with their feature requirements
  const allTabs = [
    {
      key: 'dashboard' as TabKey,
      label: 'Dashboard',
      icon: LayoutDashboard,
      requiresFeature: null, // Always visible
    },
    {
      key: 'orders' as TabKey,
      label: 'Bestellingen',
      icon: Package,
      requiresFeature: 'checkout' as const,
    },
    {
      key: 'subscriptions' as TabKey,
      label: 'Abonnementen',
      icon: CreditCard,
      requiresFeature: 'subscriptions' as const,
    },
    {
      key: 'licenses' as TabKey,
      label: 'Licenties',
      icon: KeyRound,
      requiresFeature: 'licenses' as const,
    },
    {
      key: 'gift-vouchers' as TabKey,
      label: 'Cadeaubonnen',
      icon: Gift,
      requiresFeature: 'giftVouchers' as const,
    },
    {
      key: 'loyalty' as TabKey,
      label: 'Loyalty',
      icon: Award,
      requiresFeature: 'loyalty' as const,
    },
    {
      key: 'invoices' as TabKey,
      label: 'Facturen',
      icon: FileText,
      requiresFeature: 'invoices' as const,
    },
    {
      key: 'order-lists' as TabKey,
      label: 'Bestelformulieren',
      icon: ClipboardList,
      requiresFeature: 'orderLists' as const,
    },
    {
      key: 'recurring-orders' as TabKey,
      label: 'Terugkerende Orders',
      icon: RefreshCw,
      requiresFeature: 'recurringOrders' as const,
    },
    {
      key: 'favorites' as TabKey,
      label: 'Favorieten',
      icon: Heart,
      requiresFeature: 'wishlists' as const,
    },
    {
      key: 'addresses' as TabKey,
      label: 'Adressen',
      icon: MapPin,
      requiresFeature: 'addresses' as const,
    },
  ]

  // Filter tabs based on enabled features
  const tabs = allTabs.filter((tab) => {
    if (!tab.requiresFeature) return true // Always show tabs without feature requirement
    return features[tab.requiresFeature] === true
  })

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
          Mijn Account
        </h1>
        <p className="text-sm lg:text-base text-gray-500">
          Beheer je bestellingen, adressen en instellingen.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-semibold whitespace-nowrap transition-colors
                  ${isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {/* Total Orders */}
                {features.checkout && (
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-blue-100">
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
                    <div className="text-xs text-gray-500 mt-1">Alle tijd</div>
                  </div>
                )}

                {/* Orders In Transit */}
                {features.checkout && features.orderTracking && (
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-orange-100">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
                      <div
                        className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
                        style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                      >
                        <Truck className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-warning)' }} />
                      </div>
                      <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
                        {stats.ordersInTransit}
                      </div>
                    </div>
                    <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
                      Onderweg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Track & trace</div>
                  </div>
                )}

                {/* Order Lists */}
                {features.orderLists && (
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-green-100">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
                      <div
                        className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
                        style={{ background: 'rgba(0, 200, 83, 0.1)' }}
                      >
                        <ClipboardList className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-success)' }} />
                      </div>
                      <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
                        {stats.orderLists}
                      </div>
                    </div>
                    <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">
                      Bestelformulieren
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Opgeslagen lijsten</div>
                  </div>
                )}

                {/* Yearly Spend */}
                {features.checkout && (
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-purple-100">
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
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                <h2 className="text-base lg:text-lg font-extrabold mb-3 lg:mb-4 text-gray-900">
                  Snelle acties
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                  {features.recurringOrders && (
                    <button
                      onClick={() => setActiveTab('recurring-orders')}
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
                  )}

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

              {/* Recent Orders Preview */}
              {features.checkout && (
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4 lg:mb-5">
                    <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
                      Recente bestellingen
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <span className="hidden lg:inline">Alle bestellingen</span>
                      <span className="lg:hidden">Alle</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentOrders.slice(0, 3).map((order) => {
                      const statusColors = getStatusColor(order.status)
                      return (
                        <div
                          key={order.id}
                          className="p-3 lg:p-4 rounded-xl"
                          style={{ border: '1.5px solid var(--color-border)' }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs lg:text-sm font-bold text-gray-900 font-mono">
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
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {new Date(order.date).toLocaleDateString('nl-NL')}
                            </div>
                            <div className="text-base lg:text-lg font-bold text-gray-900">
                              €{order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && features.checkout && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Alle bestellingen</h2>
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
                          <span className="text-xs lg:text-sm font-bold text-gray-900 font-mono">
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
                      {order.trackingUrl && features.orderTracking && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:bg-gray-100 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
                        >
                          Track & trace
                        </a>
                      )}
                      {order.invoiceUrl && features.invoices && (
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
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && features.subscriptions && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Mijn Abonnementen</h2>
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Je hebt nog geen actieve abonnementen.</p>
                <Link
                  href="/shop/"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Bekijk abonnementen
                </Link>
              </div>
            </div>
          )}

          {/* Licenses Tab */}
          {activeTab === 'licenses' && features.licenses && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Mijn Licenties</h2>
              <div className="text-center py-12 text-gray-500">
                <KeyRound className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Je hebt nog geen actieve licenties.</p>
                <Link
                  href="/shop/"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Bekijk software licenties
                </Link>
              </div>
            </div>
          )}

          {/* Gift Vouchers Tab */}
          {activeTab === 'gift-vouchers' && features.giftVouchers && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Mijn Cadeaubonnen</h2>
              <div className="text-center py-12 text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Je hebt nog geen cadeaubonnen.</p>
                <Link
                  href="/shop/"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Koop cadeaubon
                </Link>
              </div>
            </div>
          )}

          {/* Loyalty Tab */}
          {activeTab === 'loyalty' && features.loyalty && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Loyalty Programma</h2>
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Welkom bij ons loyalty programma!</p>
                <p className="mt-2 text-sm">Verdien punten met elke aankoop.</p>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && features.invoices && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Mijn Facturen</h2>
              <div className="space-y-3">
                {recentOrders.filter(o => o.invoiceUrl).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</div>
                      <a
                        href={order.invoiceUrl || '#'}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Lists Tab */}
          {activeTab === 'order-lists' && features.orderLists && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Bestelformulieren</h2>
                <Link
                  href="/my-account/lists/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  + Nieuwe lijst
                </Link>
              </div>
              <div className="space-y-3">
                {orderLists.map((list) => (
                  <div
                    key={list.id}
                    className="p-3 lg:p-4 rounded-xl cursor-pointer transition-all active:scale-95 lg:hover:scale-[1.01] border border-gray-200"
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
                          className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center text-base lg:text-lg bg-gray-50 border border-gray-200"
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
              </div>
            </div>
          )}

          {/* Recurring Orders Tab */}
          {activeTab === 'recurring-orders' && features.recurringOrders && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Terugkerende Bestellingen</h2>
              <div className="text-center py-12 text-gray-500">
                <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Je hebt nog geen terugkerende bestellingen ingesteld.</p>
                <button className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Maak terugkerende bestelling
                </button>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && features.wishlists && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Favorieten</h2>
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Je hebt nog geen favoriete producten.</p>
                <Link
                  href="/shop/"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Bekijk producten
                </Link>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && features.addresses && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Mijn Adressen</h2>
                <Link
                  href="/my-account/addresses/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  + Nieuw adres
                </Link>
              </div>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-3 lg:p-4 rounded-xl border border-gray-200"
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
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        Bewerken
                      </button>
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
          )}
        </div>
      </div>
    </div>
  )
}
