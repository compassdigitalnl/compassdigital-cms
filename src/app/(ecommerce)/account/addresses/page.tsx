'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import AddressesTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/AddressesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'

const emptyFormData = {
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
}

export default function AddressesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewAddressModal, setShowNewAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyFormData)

  const fetchAddresses = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/account/addresses', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.docs || [])
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await fetch(`/api/account/addresses/${editingAddress}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        await fetch('/api/account/addresses', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      setShowNewAddressModal(false)
      setEditingAddress(null)
      setFormData(emptyFormData)
      fetchAddresses()
    } catch (err) {
      console.error('Error saving address:', err)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Weet je zeker dat je dit adres wilt verwijderen?')) return
    try {
      await fetch(`/api/account/addresses/${addressId}`, { method: 'DELETE', credentials: 'include' })
      fetchAddresses()
    } catch (err) {
      console.error('Error deleting address:', err)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      await fetch(`/api/account/addresses/${addressId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrimary: true }),
      })
      fetchAddresses()
    } catch (err) {
      console.error('Error setting default address:', err)
    }
  }

  const handleCloseModal = () => {
    setShowNewAddressModal(false)
    setEditingAddress(null)
  }

  const handleStartEdit = (address: any) => {
    setEditingAddress(address.id || address._id)
    setFormData({
      type: address.type || 'shipping',
      name: address.name || address.company || '',
      contactPerson: address.contactPerson || '',
      street: address.street || '',
      houseNumber: address.houseNumber || '',
      addition: address.addition || '',
      postalCode: address.postalCode || '',
      city: address.city || '',
      country: address.country || 'Nederland',
      isDefault: address.isPrimary || address.isDefault || false,
      kvk: address.kvk || '',
      vat: address.vat || '',
    })
  }

  if (authLoading || isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <AddressesTemplate
      addresses={addresses}
      formData={formData}
      onUpdateForm={(data) => setFormData({ ...formData, ...data })}
      showNewAddressModal={showNewAddressModal}
      editingAddress={editingAddress}
      onOpenNewModal={() => setShowNewAddressModal(true)}
      onCloseModal={handleCloseModal}
      onSaveAddress={handleSaveAddress}
      onDeleteAddress={handleDeleteAddress}
      onSetDefault={handleSetDefault}
      onStartEdit={handleStartEdit}
    />
  )
}
