'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/components/account/ui'
import {
  RetourProgressBar,
  RetourItemSelector,
  RetourReasonForm,
  RetourConfirmation,
  RetourSuccess,
} from '@/branches/ecommerce/components/account/retour'
import type { Step } from '@/branches/ecommerce/components/account/retour/types'
import type { RetourTemplateProps } from './types'

export default function RetourTemplate({
  orderId,
  orderNumber,
  items: initialItems,
  onSubmit,
  isLoading,
}: RetourTemplateProps) {
  const [step, setStep] = useState<Step>('select')
  const [items, setItems] = useState(initialItems)
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) return <AccountLoadingSkeleton variant="detail" />

  const selectedItems = items.filter((item) => item.selected)

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
  }

  const setItemReason = (id: string, reason: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, reason } : item)))
  }

  const setItemQuantity = (id: string, quantity: number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(Math.max(1, quantity), item.maxQuantity) } : item,
    ))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({
        items: selectedItems.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          reason: item.reason || 'no_longer_needed',
        })),
      })
      setStep('done')
    } catch {
      alert('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/account/orders/${orderId}`}
          className="flex items-center gap-2 text-sm font-semibold mb-3 transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Terug naar bestelling
        </Link>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 text-gray-900">
          Retour aanvragen
        </h1>
        <p className="text-sm text-gray-500">
          Bestelling <span className="font-mono font-bold">{orderNumber}</span>
        </p>
      </div>

      {step !== 'done' && <RetourProgressBar currentStep={step} />}

      {step === 'select' && (
        <RetourItemSelector
          items={items}
          onToggleItem={toggleItem}
          onSetQuantity={setItemQuantity}
          onNext={() => setStep('reason')}
          selectedCount={selectedItems.length}
        />
      )}

      {step === 'reason' && (
        <RetourReasonForm
          items={selectedItems}
          onSetReason={setItemReason}
          onNext={() => setStep('confirm')}
          onPrev={() => setStep('select')}
        />
      )}

      {step === 'confirm' && (
        <RetourConfirmation
          items={selectedItems}
          onSubmit={handleSubmit}
          onPrev={() => setStep('reason')}
          submitting={submitting}
        />
      )}

      {step === 'done' && <RetourSuccess />}
    </div>
  )
}
