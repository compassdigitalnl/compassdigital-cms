'use client'

import React, { useState } from 'react'
import { Button } from '@/branches/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/branches/shared/components/ui/dialog'

interface CreateAddressModalProps {
  onAddressCreated?: (address: any) => void
  callback?: (address: any) => void
  children?: React.ReactNode
  disabled?: boolean
  skipSubmission?: boolean
}

export const CreateAddressModal: React.FC<CreateAddressModalProps> = ({
  onAddressCreated,
  callback,
  children,
  disabled = false,
  skipSubmission = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    street: '',
    houseNumber: '',
    houseNumberAddition: '',
    postalCode: '',
    city: '',
    country: 'Nederland',
    phone: '',
    isDefault: false,
    type: 'both' as 'delivery' | 'billing' | 'both',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Create address object
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }

      // If skipSubmission is true, just call the callback with the address
      // without actually saving it to the backend (for guest checkout)
      if (skipSubmission) {
        callback?.(newAddress)
        onAddressCreated?.(newAddress)
        setIsOpen(false)
      } else {
        // Simulate API call for actual submission
        await new Promise((resolve) => setTimeout(resolve, 500))

        callback?.(newAddress)
        onAddressCreated?.(newAddress)
        setIsOpen(false)
      }

      // Reset form
      setFormData({
        name: '',
        company: '',
        street: '',
        houseNumber: '',
        houseNumberAddition: '',
        postalCode: '',
        city: '',
        country: 'Nederland',
        phone: '',
        isDefault: false,
        type: 'both',
      })
    } catch (error) {
      console.error('Error creating address:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children || <Button disabled={disabled}>Nieuw adres toevoegen</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nieuw adres toevoegen</DialogTitle>
          <DialogDescription>Voeg een nieuw bezorg- of factuuradres toe</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type adres</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleChange('type', 'delivery')}
                className={`px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-colors ${
                  formData.type === 'delivery'
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bezorgadres
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'billing')}
                className={`px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-colors ${
                  formData.type === 'billing'
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Factuuradres
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'both')}
                className={`px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-colors ${
                  formData.type === 'both'
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Beide
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Adres naam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Bijv. Thuis, Werk, etc."
              className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          {/* Company (Optional) */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Bedrijfsnaam (optioneel)
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Uw bedrijfsnaam"
              className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          {/* Street Address */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="lg:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Straatnaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                required
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="Straatnaam"
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Huisnr. <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="houseNumber"
                  required
                  value={formData.houseNumber}
                  onChange={(e) => handleChange('houseNumber', e.target.value)}
                  placeholder="123"
                  className="w-20 px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                />
                <input
                  type="text"
                  id="houseNumberAddition"
                  value={formData.houseNumberAddition}
                  onChange={(e) => handleChange('houseNumberAddition', e.target.value)}
                  placeholder="A"
                  className="flex-1 px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Postal Code & City */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="1234 AB"
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Plaats <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Amsterdam"
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Land <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              required
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            >
              <option value="Nederland">Nederland</option>
              <option value="België">België</option>
              <option value="Duitsland">Duitsland</option>
              <option value="Frankrijk">Frankrijk</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefoonnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+31 6 12345678"
              className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleChange('isDefault', e.target.checked)}
              className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-700"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Instellen als standaard adres
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
              className="w-full lg:w-auto"
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full lg:w-auto">
              {isSaving ? 'Opslaan...' : 'Adres opslaan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
