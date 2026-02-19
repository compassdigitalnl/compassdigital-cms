'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, MapPin, Edit2, Trash2, Star } from 'lucide-react'

export default function AddressesPage() {
  const [showNewAddressModal, setShowNewAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)

  // TODO: Replace with real data from API
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'shipping',
      typeLabel: 'Bezorgadres',
      isDefault: true,
      name: 'Plastimed B.V.',
      contactPerson: 'Jan de Vries',
      street: 'Parallelweg',
      houseNumber: '124',
      addition: '',
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
      contactPerson: '',
      street: 'Parallelweg',
      houseNumber: '124',
      addition: '',
      postalCode: '1948 NN',
      city: 'Beverwijk',
      country: 'Nederland',
      kvk: '12345678',
      vat: 'NL123456789B01',
    },
    {
      id: '3',
      type: 'shipping',
      typeLabel: 'Bezorgadres',
      isDefault: false,
      name: 'Plastimed - Vestiging Amsterdam',
      contactPerson: 'Maria Jansen',
      street: 'Herengracht',
      houseNumber: '501',
      addition: 'A',
      postalCode: '1017 BV',
      city: 'Amsterdam',
      country: 'Nederland',
    },
  ])

  const [formData, setFormData] = useState({
    type: 'shipping',
    name: '',
    contactPerson: '',
    street: '',
    houseNumber: '',
    addition: '',
    postalCode: '',
    city: '',
    country: 'Nederland',
    isDefault: false,
    kvk: '',
    vat: '',
  })

  const handleSaveAddress = () => {
    // TODO: Implement API call to save address
    console.log('Saving address:', formData)
    setShowNewAddressModal(false)
    setEditingAddress(null)
    // Reset form
    setFormData({
      type: 'shipping',
      name: '',
      contactPerson: '',
      street: '',
      houseNumber: '',
      addition: '',
      postalCode: '',
      city: '',
      country: 'Nederland',
      isDefault: false,
      kvk: '',
      vat: '',
    })
  }

  const handleDeleteAddress = (addressId: string) => {
    // TODO: Implement API call to delete address
    if (confirm('Weet je zeker dat je dit adres wilt verwijderen?')) {
      console.log('Deleting address:', addressId)
      setAddresses(addresses.filter((addr) => addr.id !== addressId))
    }
  }

  const handleSetDefault = (addressId: string) => {
    // TODO: Implement API call to set default address
    console.log('Setting default address:', addressId)
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
            Adressen
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            {addresses.length} {addresses.length === 1 ? 'adres' : 'adressen'} opgeslagen
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
            onClick={() => setShowNewAddressModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
          >
            <Plus className="w-4 h-4" />
            Nieuw adres
          </button>
        </div>
      </div>

      {/* New/Edit Address Modal */}
      {(showNewAddressModal || editingAddress) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(10,22,40,0.8)' }}
          onClick={() => {
            setShowNewAddressModal(false)
            setEditingAddress(null)
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-extrabold mb-5"
              style={{
                fontSize: '20px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {editingAddress ? 'Adres bewerken' : 'Nieuw adres toevoegen'}
            </h2>

            <div className="space-y-4 mb-5">
              {/* Address Type */}
              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ fontSize: '14px', color: '#0A1628' }}
                >
                  Type adres
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'shipping' })}
                    className="px-4 py-3 rounded-xl font-semibold transition-all"
                    style={{
                      background:
                        formData.type === 'shipping' ? 'rgba(0,137,123,0.1)' : '#F5F7FA',
                      color: formData.type === 'shipping' ? '#00897B' : '#0A1628',
                      border: `1.5px solid ${formData.type === 'shipping' ? '#00897B' : '#E8ECF1'}`,
                      fontSize: '14px',
                    }}
                  >
                    Bezorgadres
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'billing' })}
                    className="px-4 py-3 rounded-xl font-semibold transition-all"
                    style={{
                      background: formData.type === 'billing' ? 'rgba(0,137,123,0.1)' : '#F5F7FA',
                      color: formData.type === 'billing' ? '#00897B' : '#0A1628',
                      border: `1.5px solid ${formData.type === 'billing' ? '#00897B' : '#E8ECF1'}`,
                      fontSize: '14px',
                    }}
                  >
                    Factuuradres
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ fontSize: '14px', color: '#0A1628' }}
                  >
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Plastimed B.V."
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ fontSize: '14px', color: '#0A1628' }}
                  >
                    Contactpersoon
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Jan de Vries"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label
                    className="block font-semibold mb-2"
                    style={{ fontSize: '14px', color: '#0A1628' }}
                  >
                    Straat
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Parallelweg"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ fontSize: '14px', color: '#0A1628' }}
                    >
                      Nr.
                    </label>
                    <input
                      type="text"
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      placeholder="124"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ fontSize: '14px', color: '#0A1628' }}
                    >
                      Tov.
                    </label>
                    <input
                      type="text"
                      value={formData.addition}
                      onChange={(e) => setFormData({ ...formData, addition: e.target.value })}
                      placeholder="A"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ fontSize: '14px', color: '#0A1628' }}
                  >
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1948 NN"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ fontSize: '14px', color: '#0A1628' }}
                  >
                    Plaats
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Beverwijk"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* B2B Fields for Billing Address */}
              {formData.type === 'billing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3" style={{ borderTop: '1px solid #E8ECF1' }}>
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ fontSize: '14px', color: '#0A1628' }}
                    >
                      KVK-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.kvk}
                      onChange={(e) => setFormData({ ...formData, kvk: e.target.value })}
                      placeholder="12345678"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      style={{ fontSize: '14px', color: '#0A1628' }}
                    >
                      BTW-nummer
                    </label>
                    <input
                      type="text"
                      value={formData.vat}
                      onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                      placeholder="NL123456789B01"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                    />
                  </div>
                </div>
              )}

              {/* Default Checkbox */}
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #E8ECF1' }}>
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: '#00897B' }}
                />
                <label
                  htmlFor="isDefault"
                  className="font-semibold cursor-pointer"
                  style={{ fontSize: '14px', color: '#0A1628' }}
                >
                  Instellen als standaard {formData.type === 'shipping' ? 'bezorgadres' : 'factuuradres'}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewAddressModal(false)
                  setEditingAddress(null)
                }}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:bg-gray-100"
                style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
              >
                Annuleren
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#00897B' }} />
                <span className="font-bold" style={{ fontSize: '15px', color: '#0A1628' }}>
                  {address.typeLabel}
                </span>
                {address.isDefault && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: 'rgba(0,137,123,0.1)',
                      color: '#00897B',
                      fontSize: '11px',
                    }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Standaard
                  </span>
                )}
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#0A1628', lineHeight: '1.6' }} className="mb-4">
              <div className="font-semibold">{address.name}</div>
              {address.contactPerson && <div>{address.contactPerson}</div>}
              <div>
                {address.street} {address.houseNumber}
                {address.addition && ` ${address.addition}`}
              </div>
              <div>
                {address.postalCode} {address.city}
              </div>
              <div>{address.country}</div>
              {address.kvk && (
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid #E8ECF1', color: '#94A3B8' }}>
                  <div>KVK: {address.kvk}</div>
                  <div>BTW: {address.vat}</div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all hover:bg-gray-100"
                  style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '13px' }}
                >
                  <Star className="w-3.5 h-3.5" />
                  Standaard
                </button>
              )}
              <button
                onClick={() => setEditingAddress(address.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all hover:bg-gray-100"
                style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '13px' }}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Bewerken
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="px-3 py-2 rounded-lg font-semibold transition-all hover:bg-red-50"
                style={{ background: '#F5F7FA', color: '#FF6B6B', fontSize: '13px' }}
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
