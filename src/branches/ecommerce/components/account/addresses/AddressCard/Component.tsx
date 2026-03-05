'use client'

import React from 'react'
import { MapPin, Trash2, Star, Pencil } from 'lucide-react'
import type { AddressCardProps } from './types'

export function AddressCard({ address, onDelete, onSetDefault, onEdit }: AddressCardProps) {
  const id = address.id || address._id

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
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
        <button
          onClick={() => onEdit(address)}
          className="btn btn-sm btn-outline-neutral flex-1 flex items-center justify-center gap-1.5 lg:gap-2"
        >
          <Pencil className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
          <span className="hidden lg:inline">Bewerken</span>
        </button>
        {!address.isPrimary && !address.isDefault && (
          <button
            onClick={() => onSetDefault(id)}
            className="btn btn-sm btn-outline-neutral flex-1 flex items-center justify-center gap-1.5 lg:gap-2"
          >
            <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
            <span className="hidden lg:inline">Standaard</span>
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          className="btn btn-sm btn-danger"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
