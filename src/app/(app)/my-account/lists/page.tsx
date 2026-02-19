'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit2,
  ShoppingCart,
  Package,
  MoreVertical,
} from 'lucide-react'

export default function OrderListsPage() {
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [newListName, setNewListName] = useState('')

  // TODO: Replace with real data from API
  const orderLists = [
    {
      id: '1',
      name: 'Maandelijkse voorraad',
      description: 'Standaard bestelling voor elke maand',
      productCount: 8,
      products: [
        { id: '1', emoji: '🧤', name: 'Latex handschoenen', quantity: 10, price: 12.95 },
        { id: '2', emoji: '🧴', name: 'Handgel dispenser', quantity: 5, price: 24.0 },
        { id: '3', emoji: '🗑️', name: 'Afvalbak pedaal', quantity: 2, price: 45.99 },
        { id: '4', emoji: '🧻', name: 'Papieren handdoekjes', quantity: 20, price: 8.5 },
        { id: '5', emoji: '🧼', name: 'Zeep navulling', quantity: 15, price: 6.25 },
      ],
      total: 456.8,
      createdAt: '2026-01-15',
      updatedAt: '2026-02-10',
    },
    {
      id: '2',
      name: 'Examenruimte benodigdheden',
      description: 'Voor examenperiode (2x per jaar)',
      productCount: 5,
      products: [
        { id: '1', emoji: '🧤', name: 'Nitril handschoenen', quantity: 5, price: 14.5 },
        { id: '2', emoji: '🧴', name: 'Desinfectie spray', quantity: 3, price: 18.99 },
        { id: '3', emoji: '🗑️', name: 'Afvalzak rollen', quantity: 10, price: 12.5 },
        { id: '4', emoji: '🧻', name: 'Toiletpapier', quantity: 8, price: 15.75 },
      ],
      total: 234.5,
      createdAt: '2025-12-20',
      updatedAt: '2026-01-05',
    },
    {
      id: '3',
      name: 'Schoonmaak supplies',
      description: '',
      productCount: 6,
      products: [
        { id: '1', emoji: '🧼', name: 'Allesreiniger', quantity: 12, price: 9.95 },
        { id: '2', emoji: '🧴', name: 'Vloerr einiger', quantity: 8, price: 12.5 },
        { id: '3', emoji: '🗑️', name: 'Vuilniszakken 60L', quantity: 15, price: 8.99 },
      ],
      total: 312.35,
      createdAt: '2025-11-10',
      updatedAt: '2025-11-10',
    },
  ]

  const handleCreateList = () => {
    // TODO: Implement API call to create list
    console.log('Creating list:', newListName)
    setNewListName('')
    setShowNewListModal(false)
  }

  const handleDeleteList = (listId: string) => {
    // TODO: Implement API call to delete list
    if (confirm('Weet je zeker dat je deze bestellijst wilt verwijderen?')) {
      console.log('Deleting list:', listId)
    }
  }

  const handleOrderAll = (listId: string) => {
    // TODO: Implement add all products to cart
    console.log('Ordering all products from list:', listId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-extrabold mb-2"
            style={{
              fontSize: '28px',
              color: '#0A1628',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Bestellijsten
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            {orderLists.length} bestellijsten opgeslagen
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/my-account"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
            style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => setShowNewListModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
          >
            <Plus className="w-4 h-4" />
            Nieuwe lijst
          </button>
        </div>
      </div>

      {/* New List Modal */}
      {showNewListModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,22,40,0.8)' }}
          onClick={() => setShowNewListModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-extrabold mb-4"
              style={{
                fontSize: '20px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Nieuwe bestellijst
            </h2>

            <div className="mb-5">
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                Naam van de lijst
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Bijv. Maandelijkse voorraad"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNewListModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:bg-gray-100"
                style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
              >
                Annuleren
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
              >
                Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Lists */}
      <div className="grid grid-cols-1 gap-6">
        {orderLists.map((list) => (
          <div key={list.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="p-6 pb-4" style={{ borderBottom: '1px solid #E8ECF1' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3
                    className="font-extrabold mb-1"
                    style={{
                      fontSize: '18px',
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {list.name}
                  </h3>
                  {list.description && (
                    <p style={{ fontSize: '13px', color: '#94A3B8' }}>{list.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" style={{ color: '#94A3B8' }} />
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                        {list.productCount} producten
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Laatst gewijzigd:{' '}
                      {new Date(list.updatedAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div
                  className="font-extrabold"
                  style={{
                    fontSize: '24px',
                    color: '#00897B',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  €{list.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {list.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#F5F7FA' }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'white', fontSize: '24px' }}
                    >
                      {product.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold truncate"
                        style={{ fontSize: '13px', color: '#0A1628' }}
                      >
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                          {product.quantity}x
                        </span>
                        <span
                          className="font-semibold"
                          style={{ fontSize: '12px', color: '#00897B' }}
                        >
                          €{product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOrderAll(list.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                  style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Bestel alles
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
                  style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
                >
                  <Edit2 className="w-4 h-4" />
                  Bewerken
                </button>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-red-50"
                  style={{ background: '#F5F7FA', color: '#FF6B6B', fontSize: '14px' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {orderLists.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(0,137,123,0.1)' }}
            >
              <Package className="w-10 h-10" style={{ color: '#00897B' }} />
            </div>
            <h3
              className="font-extrabold mb-2"
              style={{
                fontSize: '20px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Nog geen bestellijsten
            </h3>
            <p className="mb-6" style={{ fontSize: '14px', color: '#94A3B8' }}>
              Maak een bestellijst aan om producten te groeperen voor snelle herhaalbestellingen.
            </p>
            <button
              onClick={() => setShowNewListModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
            >
              <Plus className="w-4 h-4" />
              Maak je eerste lijst
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
