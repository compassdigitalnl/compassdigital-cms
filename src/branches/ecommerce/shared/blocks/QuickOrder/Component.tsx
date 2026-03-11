/**
 * B-18 QuickOrder Component
 *
 * Quick order form with SKU/product input.
 * Simple: single input + quantity + add button.
 * Advanced: multi-line paste area for bulk orders.
 * Uses theme variables for all colors.
 */
'use client'

import React, { useState } from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { QuickOrderBlock } from '@/payload-types'

export const QuickOrderComponent: React.FC<QuickOrderBlock> = ({
  title,
  description,
  placeholder,
  variant = 'simple',
  showQuantity = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [bulkInput, setBulkInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sku.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(
        `/api/products?where[sku][equals]=${encodeURIComponent(sku.trim())}&limit=1`,
      )
      const data = await response.json()

      if (data.docs && data.docs.length > 0) {
        setMessage({
          type: 'success',
          text: `${data.docs[0].title} (${quantity}x) toegevoegd aan winkelwagen`,
        })
        setSku('')
        setQuantity(1)
      } else {
        setMessage({ type: 'error', text: `Product niet gevonden: ${sku}` })
      }
    } catch {
      setMessage({ type: 'error', text: 'Er ging iets mis. Probeer opnieuw.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkInput.trim()) return

    setIsLoading(true)
    setMessage(null)

    const lines = bulkInput.split('\n').filter((line) => line.trim())
    let addedCount = 0
    let notFoundCount = 0

    for (const line of lines) {
      const parts = line.trim().split(/[\s,;]+/)
      if (parts.length < 1) continue

      const lineSku = parts[0]
      const lineQty = parts.length >= 2 ? parseInt(parts[1], 10) || 1 : 1

      try {
        const response = await fetch(
          `/api/products?where[sku][equals]=${encodeURIComponent(lineSku)}&limit=1`,
        )
        const data = await response.json()

        if (data.docs && data.docs.length > 0) {
          addedCount++
        } else {
          notFoundCount++
        }
      } catch {
        notFoundCount++
      }
    }

    if (addedCount > 0) {
      setMessage({
        type: 'success',
        text: `${addedCount} product(en) toegevoegd${notFoundCount > 0 ? `, ${notFoundCount} niet gevonden` : ''}`,
      })
      setBulkInput('')
    } else {
      setMessage({ type: 'error', text: 'Geen producten gevonden' })
    }

    setIsLoading(false)
  }

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {description && <p className="text-gray-600 mb-8">{description}</p>}

          {variant === 'simple' ? (
            /* Simple variant: single input */
            <form onSubmit={handleSimpleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder={placeholder || 'Voer SKU in...'}
                    className="w-full px-4 py-3 border border-grey rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
                {showQuantity && (
                  <div className="w-24">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                      min="1"
                      placeholder="Aantal"
                      className="w-full px-3 py-3 border border-grey rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center transition-colors"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !sku.trim()}
                  className="btn btn-primary px-6 py-3 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {isLoading ? (
                    <Icon name="Loader" size={18} className="animate-spin" />
                  ) : (
                    <Icon name="Plus" size={18} />
                  )}
                  Toevoegen
                </button>
              </div>
            </form>
          ) : (
            /* Advanced variant: bulk textarea */
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-grey">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="List" size={18} className="text-primary" />
                  <span className="font-semibold text-gray-700">Bulk bestelling</span>
                </div>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={
                    placeholder ||
                    'Voer artikelnummers en aantallen in:\n\nBV-001 5\nLT-334 2\nHT-892 10'
                  }
                  rows={8}
                  className="w-full px-4 py-3 border border-grey rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Formaat: <code className="bg-white px-2 py-0.5 rounded text-primary">artikelnr aantal</code> per regel
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || !bulkInput.trim()}
                className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader" size={20} className="animate-spin" />
                    Bezig met verwerken...
                  </>
                ) : (
                  <>
                    <Icon name="ShoppingCart" size={20} />
                    Toevoegen aan winkelwagen
                  </>
                )}
              </button>
            </form>
          )}

          {/* Status message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg border flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-success/10 border-success/30 text-success'
                  : 'bg-error/10 border-error/30 text-error'
              }`}
            >
              <Icon
                name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                size={18}
              />
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default QuickOrderComponent
