'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { AddressCard } from '@/branches/ecommerce/shared/components/account/addresses'
import { AddressFormModal } from '@/branches/ecommerce/shared/components/account/addresses'
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
  onStartEdit,
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
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nieuw adres
          </button>
        </div>
      </div>

      {/* New/Edit Address Modal */}
      {(showNewAddressModal || editingAddress) && (
        <AddressFormModal
          formData={formData}
          onUpdateForm={onUpdateForm}
          editingAddress={editingAddress}
          onClose={onCloseModal}
          onSave={onSaveAddress}
        />
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {addresses.map((address: any) => (
          <AddressCard
            key={address.id || address._id}
            address={address}
            onDelete={onDeleteAddress}
            onSetDefault={onSetDefault}
            onEdit={onStartEdit}
          />
        ))}
      </div>
    </div>
  )
}
