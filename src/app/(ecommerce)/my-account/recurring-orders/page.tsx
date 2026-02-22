'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, Calendar, Package, Euro, Play, Pause, Trash2, Settings as SettingsIcon } from 'lucide-react'

export default function RecurringOrdersPage() {
  // TODO: Replace with real recurring orders data from API
  const [recurringOrders] = useState([
    {
      id: 1,
      name: 'Maandelijkse voorraad',
      frequency: 'monthly',
      frequencyLabel: 'Maandelijks',
      nextDelivery: '2026-03-15',
      productCount: 8,
      products: [
        { emoji: '🧤', name: 'Latex handschoenen', quantity: 10 },
        { emoji: '🧴', name: 'Handgel dispenser', quantity: 5 },
        { emoji: '🗑️', name: 'Afvalbak pedaal', quantity: 2 },
      ],
      total: 456.80,
      status: 'active',
      statusLabel: 'Actief',
      createdAt: '2025-06-15',
    },
    {
      id: 2,
      name: 'Kwartaal bestelling',
      frequency: 'quarterly',
      frequencyLabel: 'Per kwartaal',
      nextDelivery: '2026-04-01',
      productCount: 5,
      products: [
        { emoji: '🧤', name: 'Nitril handschoenen', quantity: 20 },
        { emoji: '🧻', name: 'Papieren handdoekjes', quantity: 15 },
      ],
      total: 234.50,
      status: 'paused',
      statusLabel: 'Gepauzeerd',
      createdAt: '2025-01-10',
    },
  ])

  const handleTogglePause = (orderId: number, currentStatus: string) => {
    // TODO: Implement pause/resume API call
    const action = currentStatus === 'active' ? 'pauzeren' : 'hervatten'
    if (confirm(`Weet je zeker dat je deze terugkerende bestelling wilt ${action}?`)) {
      console.log(`Toggling recurring order ${orderId}`)
      alert(`Bestelling ${action === 'pauzeren' ? 'gepauzeerd' : 'hervat'}`)
    }
  }

  const handleDelete = (orderId: number) => {
    // TODO: Implement delete API call
    if (confirm('Weet je zeker dat je deze terugkerende bestelling wilt verwijderen?')) {
      console.log(`Deleting recurring order ${orderId}`)
      alert('Terugkerende bestelling verwijderd')
    }
  }

  const handleOrderNow = (orderId: number) => {
    // TODO: Implement order now functionality
    console.log(`Ordering now from recurring order ${orderId}`)
    alert('Bestelling wordt verwerkt...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
      case 'paused':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const getFrequencyIcon = (frequency: string) => {
    return <RefreshCw className="w-4 h-4" />
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Terugkerende Bestellingen</h1>
        </div>
        <p className="text-sm text-gray-600">
          Beheer je automatische bestellingen en bezorgfrequentie
        </p>
      </div>

      {/* Info Card */}
      {recurringOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-blue-900 mb-1">Automatische bestellingen</h3>
              <p className="text-xs text-blue-700">
                Je terugkerende bestellingen worden automatisch verwerkt op de ingestelde datum.
                Je ontvangt 3 dagen van tevoren een herinneringsmail.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Orders List */}
      {recurringOrders.length > 0 ? (
        <div className="space-y-4">
          {recurringOrders.map((order) => {
            const statusColors = getStatusColor(order.status)
            const daysUntilNext = Math.ceil(
              (new Date(order.nextDelivery).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getFrequencyIcon(order.frequency)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold">{order.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                            {order.statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{order.frequencyLabel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{order.productCount} producten</span>
                          </div>
                        </div>
                        {order.status === 'active' && (
                          <div className="text-xs text-gray-600">
                            Volgende levering: <span className="font-semibold">{new Date(order.nextDelivery).toLocaleDateString('nl-NL')}</span>
                            {daysUntilNext > 0 && ` (over ${daysUntilNext} dagen)`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">€{order.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">per bestelling</div>
                    </div>
                  </div>
                </div>

                {/* Products Preview */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {order.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 flex-shrink-0"
                      >
                        <span className="text-lg">{product.emoji}</span>
                        <div className="text-xs">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-gray-500">{product.quantity}x</div>
                        </div>
                      </div>
                    ))}
                    {order.productCount > order.products.length && (
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600 flex-shrink-0">
                        +{order.productCount - order.products.length} meer
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOrderNow(order.id)}
                    className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Bestel nu
                  </button>
                  <button
                    onClick={() => handleTogglePause(order.id, order.status)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
                  >
                    {order.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pauzeren
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Hervatten
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    Aanpassen
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Verwijderen
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Geen terugkerende bestellingen</h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Stel een terugkerende bestelling in voor producten die je regelmatig nodig hebt.
            Zo hoef je niet steeds opnieuw te bestellen!
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/my-account/lists"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Gebruik bestellijst
            </Link>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Bekijk producten
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
