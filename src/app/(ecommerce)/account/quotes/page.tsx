'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { useSearchParams } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import QuotesTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/QuotesTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import { toast } from '@/lib/toast'
import type { QuoteProduct, QuoteFormData } from '@/branches/ecommerce/templates/account/AccountTemplate1/QuotesTemplate/types'

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

export default function QuotesPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<QuoteProduct[]>([])
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState<{ phone?: string; email?: string }>({})

  // Fetch contact info from settings
  useEffect(() => {
    fetch('/api/globals/settings?depth=0')
      .then((r) => r.json())
      .then((data) => {
        setContactInfo({ phone: data?.phone || '', email: data?.email || '' })
      })
      .catch(() => {})
  }, [])

  // Pre-fill from order list (if redirected from order list detail)
  useEffect(() => {
    const productIds = searchParams?.get('products')
    if (productIds && products.length === 0) {
      const ids = productIds.split(',')
      Promise.all(
        ids.map((id) =>
          fetch(`/api/products/search?q=${encodeURIComponent(id)}&limit=1`)
            .then((r) => r.json())
            .then((data) => data.docs?.[0])
            .catch(() => null),
        ),
      ).then((results) => {
        const validProducts: QuoteProduct[] = results
          .filter(Boolean)
          .map((p: any) => ({
            id: String(p.id),
            name: p.title || p.name,
            sku: p.sku || '',
            emoji: '📦',
            quantity: 1,
          }))
        if (validProducts.length > 0) setProducts(validProducts)
      })
    }
  }, [searchParams])

  // Pre-fill company info from user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || (user as any).phone || '',
        companyName: prev.companyName || (user as any).company || '',
      }))
    }
  }, [user])

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

  const handleAddProduct = (product: QuoteProduct) => {
    if (products.some((p) => p.id === product.id)) {
      toast.info('Product staat al in de lijst')
      return
    }
    setProducts((prev) => [...prev, product])
  }

  const handleSubmit = async () => {
    if (!formData.agreedToPrivacy) {
      toast.error('Ga akkoord met de privacyverklaring om door te gaan')
      return
    }
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      toast.error('Vul alle verplichte velden in')
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
        toast.success('Uw offerte is succesvol aangevraagd', 'U ontvangt binnen 24 uur een reactie')
        setProducts([])
        setFormData(INITIAL_FORM_DATA)
      } else {
        toast.error('Er is iets misgegaan. Probeer het later opnieuw.')
      }
    } catch {
      toast.error('Er is iets misgegaan. Probeer het later opnieuw.')
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
      onAddProduct={handleAddProduct}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isLoading={authLoading}
      contactPhone={contactInfo.phone}
      contactEmail={contactInfo.email}
    />
  )
}
