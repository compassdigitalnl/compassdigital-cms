'use client'

import React, { useState } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import QuotesTemplate from '@/branches/ecommerce/templates/account/QuotesTemplate'
import type { QuoteProduct, QuoteFormData } from '@/branches/ecommerce/templates/account/QuotesTemplate/types'

const INITIAL_FORM_DATA: QuoteFormData = {
  companyName: '',
  kvkNumber: '',
  contactPerson: '',
  email: '',
  phone: '',
  sector: '',
  desiredDeliveryDate: '',
  deliveryFrequency: 'Eenmalig',
  notes: '',
  wantsConsultation: false,
  agreedToPrivacy: false,
}

const SAMPLE_PRODUCTS: QuoteProduct[] = [
  { id: '1', name: 'Peha-soft Nitrile Fino — Maat M', sku: '942210', emoji: '🧤', quantity: 50 },
  { id: '2', name: 'Baktolan Protect+ Pure 100ml', sku: '232451', emoji: '🧴', quantity: 24 },
  { id: '3', name: 'BD Discardit II Spuit 10ml', sku: '309110', emoji: '💉', quantity: 100 },
]

export default function QuotesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { isLoading: authLoading } = useAccountAuth()

  const [products, setProducts] = useState<QuoteProduct[]>(SAMPLE_PRODUCTS)
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p)),
    )
  }

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleFormChange = (field: keyof QuoteFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.agreedToPrivacy) {
      alert('Ga akkoord met de privacyverklaring om door te gaan.')
      return
    }
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      alert('Vul alle verplichte velden in.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/account/quotes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, ...formData }),
      })
      if (res.ok) {
        alert('Uw offerte is succesvol aangevraagd. U ontvangt binnen 24 uur een reactie.')
        setProducts([])
        setFormData(INITIAL_FORM_DATA)
      } else {
        alert('Er is iets misgegaan. Probeer het later opnieuw.')
      }
    } catch {
      alert('Er is iets misgegaan. Probeer het later opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <QuotesTemplate
      products={products}
      formData={formData}
      onQuantityChange={handleQuantityChange}
      onRemoveProduct={handleRemoveProduct}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isLoading={authLoading}
    />
  )
}
