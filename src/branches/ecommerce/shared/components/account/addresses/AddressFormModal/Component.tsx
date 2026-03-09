'use client'

import React from 'react'
import type { AddressFormModalProps } from './types'

export function AddressFormModal({
  formData,
  onUpdateForm,
  editingAddress,
  onClose,
  onSave,
}: AddressFormModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4 overflow-y-auto bg-black/80"
      onClick={onClose}
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
                className={`btn btn-sm ${formData.type === 'shipping' ? 'btn-outline-primary' : 'btn-outline-neutral'}`}
              >
                Bezorgadres
              </button>
              <button
                onClick={() => onUpdateForm({ type: 'billing' })}
                className={`btn btn-sm ${formData.type === 'billing' ? 'btn-outline-primary' : 'btn-outline-neutral'}`}
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
          <button onClick={onClose} className="btn btn-outline-neutral flex-1">
            Annuleren
          </button>
          <button onClick={onSave} className="btn btn-primary flex-1">
            Opslaan
          </button>
        </div>
      </div>
    </div>
  )
}
