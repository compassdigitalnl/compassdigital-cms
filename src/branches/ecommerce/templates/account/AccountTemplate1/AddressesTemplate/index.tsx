'use client'

import React from 'react'
import { Plus, MapPin, Trash2, Star } from 'lucide-react'
import type { AddressesTemplateProps } from './types'

export default function AddressesTemplate({
  addresses,
  formData,
  onUpdateForm,
  showNewAddressModal,
  editingAddress,
  onOpenNewModal,
  onCloseModal,
  onSaveAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressesTemplateProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">Adressen</h1>
          <p className="text-sm lg:text-base text-gray-500">
            {addresses.length} {addresses.length === 1 ? 'adres' : 'adressen'} opgeslagen
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-teal-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Nieuw adres
          </button>
        </div>
      </div>

      {/* New/Edit Address Modal */}
      {(showNewAddressModal || editingAddress) && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4 overflow-y-auto bg-black/80"
          onClick={onCloseModal}
        >
          <div
            className="bg-white rounded-t-2xl lg:rounded-2xl p-5 lg:p-6 max-w-2xl w-full lg:my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg lg:text-xl font-extrabold mb-4 lg:mb-5 text-gray-900">
              {editingAddress ? 'Adres bewerken' : 'Nieuw adres toevoegen'}
            </h2>

            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Type adres</label>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <button
                    onClick={() => onUpdateForm({ type: 'shipping' })}
                    className={`px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-semibold transition-all ${formData.type === 'shipping' ? 'bg-teal-50 text-teal-700 border-teal-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  >
                    Bezorgadres
                  </button>
                  <button
                    onClick={() => onUpdateForm({ type: 'billing' })}
                    className={`px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-semibold transition-all ${formData.type === 'billing' ? 'bg-teal-50 text-teal-700 border-teal-700' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  >
                    Factuuradres
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Bedrijfsnaam</label>
                  <input type="text" value={formData.name} onChange={(e) => onUpdateForm({ name: e.target.value })} placeholder="Plastimed B.V." className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Contactpersoon</label>
                  <input type="text" value={formData.contactPerson} onChange={(e) => onUpdateForm({ contactPerson: e.target.value })} placeholder="Jan de Vries" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Straat</label>
                <input type="text" value={formData.street} onChange={(e) => onUpdateForm({ street: e.target.value })} placeholder="Parallelweg" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
              </div>

              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Nr.</label>
                  <input type="text" value={formData.houseNumber} onChange={(e) => onUpdateForm({ houseNumber: e.target.value })} placeholder="124" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Tov.</label>
                  <input type="text" value={formData.addition} onChange={(e) => onUpdateForm({ addition: e.target.value })} placeholder="A" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Postcode</label>
                  <input type="text" value={formData.postalCode} onChange={(e) => onUpdateForm({ postalCode: e.target.value })} placeholder="1948 NN" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Plaats</label>
                  <input type="text" value={formData.city} onChange={(e) => onUpdateForm({ city: e.target.value })} placeholder="Beverwijk" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                </div>
              </div>

              {formData.type === 'billing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">KVK-nummer</label>
                    <input type="text" value={formData.kvk} onChange={(e) => onUpdateForm({ kvk: e.target.value })} placeholder="12345678" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">BTW-nummer</label>
                    <input type="text" value={formData.vat} onChange={(e) => onUpdateForm({ vat: e.target.value })} placeholder="NL123456789B01" className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 lg:gap-3">
              <button onClick={onCloseModal} className="flex-1 px-4 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900">
                Annuleren
              </button>
              <button onClick={onSaveAddress} className="flex-1 px-4 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 bg-teal-700 text-white">
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {addresses.map((address: any) => (
          <div key={address.id || address._id} className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-teal-700" />
                <span className="text-sm lg:text-base font-bold text-gray-900">
                  {address.type === 'billing' ? 'Factuuradres' : 'Bezorgadres'}
                </span>
                {(address.isPrimary || address.isDefault) && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                    <Star className="w-3 h-3 fill-current" />
                    Standaard
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs lg:text-sm text-gray-900 leading-relaxed mb-3 lg:mb-4">
              {(address.company || address.name) && <div className="font-semibold">{address.company || address.name}</div>}
              {address.firstName && <div>{address.firstName} {address.lastName}</div>}
              <div>{address.street} {address.houseNumber}{address.addition ? ` ${address.addition}` : ''}</div>
              <div>{address.postalCode} {address.city}</div>
              {address.country && <div>{address.country}</div>}
            </div>

            <div className="flex gap-2">
              {!address.isPrimary && !address.isDefault && (
                <button
                  onClick={() => onSetDefault(address.id || address._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
                >
                  <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  <span className="hidden lg:inline">Standaard</span>
                </button>
              )}
              <button
                onClick={() => onDeleteAddress(address.id || address._id)}
                className="px-2.5 lg:px-3 py-2 rounded-lg font-semibold transition-all active:bg-red-50 lg:hover:bg-red-50 bg-gray-50 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
