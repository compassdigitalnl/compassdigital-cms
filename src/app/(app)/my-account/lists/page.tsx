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
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Mobile First */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
            Bestellijsten
          </h1>
          <p className="text-sm lg:text-base text-gray-500">
            {orderLists.length} bestellijsten opgeslagen
          </p>
        </div>

        {/* Mobile: Stacked buttons */}
        <div className="flex gap-2 lg:hidden">
          <Link
            href="/my-account"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 bg-gray-50 text-gray-900 flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => setShowNewListModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:opacity-80 bg-teal-700 text-white flex-1"
          >
            <Plus className="w-4 h-4" />
            Nieuwe lijst
          </button>
        </div>

        {/* Desktop: Horizontal buttons */}
        <div className="hidden lg:flex lg:gap-2">
          <Link
            href="/my-account"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 bg-gray-50 text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => setShowNewListModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-teal-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Nieuwe lijst
          </button>
        </div>
      </div>

      {/* New List Modal - Mobile First */}
      {showNewListModal && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4 bg-black/80"
          onClick={() => setShowNewListModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl lg:rounded-2xl p-5 lg:p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg lg:text-xl font-extrabold mb-4 text-gray-900">
              Nieuwe bestellijst
            </h2>

            <div className="mb-4 lg:mb-5">
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Naam van de lijst
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Bijv. Maandelijkse voorraad"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
                autoFocus
              />
            </div>

            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => setShowNewListModal(false)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
              >
                Annuleren
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-teal-700 text-white"
              >
                Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Lists - Mobile First */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        {orderLists.map((list) => (
          <div key={list.id} className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
            {/* List Header - Mobile First */}
            <div className="p-4 lg:p-6 lg:pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="text-base lg:text-lg font-extrabold mb-0.5 lg:mb-1 text-gray-900">
                    {list.name}
                  </h3>
                  {list.description && (
                    <p className="text-xs lg:text-sm text-gray-500">{list.description}</p>
                  )}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4 mt-2 lg:mt-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                      <span className="text-xs lg:text-sm text-gray-500">
                        {list.productCount} producten
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      <span className="hidden lg:inline">Laatst gewijzigd: </span>
                      {new Date(list.updatedAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-lg lg:text-2xl font-extrabold text-teal-700 flex-shrink-0">
                  €{list.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Products Grid - Mobile First */}
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-3 mb-3 lg:mb-4">
                {list.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2.5 lg:gap-3 p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-gray-50"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white text-xl lg:text-2xl">
                      {product.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs lg:text-sm font-semibold truncate text-gray-900">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {product.quantity}x
                        </span>
                        <span className="text-xs font-semibold text-teal-700">
                          €{product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions - Mobile First */}
              <div className="flex flex-col lg:flex-row gap-2">
                <button
                  onClick={() => handleOrderAll(list.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 lg:px-5 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 bg-teal-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Bestel alles
                </button>
                <div className="grid grid-cols-2 lg:flex gap-2">
                  <button className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900">
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden lg:inline">Bewerken</span>
                  </button>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-red-50 lg:hover:bg-red-50 bg-gray-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden lg:inline">Verwijderen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State - Mobile First */}
        {orderLists.length === 0 && (
          <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 text-center shadow-sm">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-4 lg:mb-5 flex items-center justify-center bg-teal-50">
              <Package className="w-8 h-8 lg:w-10 lg:h-10 text-teal-700" />
            </div>
            <h3 className="text-lg lg:text-xl font-extrabold mb-2 text-gray-900">
              Nog geen bestellijsten
            </h3>
            <p className="text-sm lg:text-base mb-5 lg:mb-6 text-gray-500">
              Maak een bestellijst aan om producten te groeperen voor snelle herhaalbestellingen.
            </p>
            <button
              onClick={() => setShowNewListModal(true)}
              className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 bg-teal-700 text-white"
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
