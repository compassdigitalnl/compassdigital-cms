'use client'

import React, { useState } from 'react'
import { Icon } from '@/branches/shared/components/Icon'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { QuickOrderBlock as QuickOrderType } from '@/payload-types'

export const QuickOrderComponent: React.FC<QuickOrderType> = ({
  heading,
  intro,
  showOrderLists = true,
  inputMode = 'textarea',
  placeholderText,
  submitButtonText = 'Toevoegen aan winkelwagen',
  showUpload = false,
  uploadHelpText,
}) => {
  const { addItem } = useCart()
  const [inputValue, setInputValue] = useState('')
  const [singleSKU, setSingleSKU] = useState('')
  const [singleQuantity, setSingleQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Parse input based on mode
      let items: { sku: string; quantity: number }[] = []

      if (inputMode === 'single' || (inputMode === 'both' && singleSKU)) {
        items.push({ sku: singleSKU.trim(), quantity: singleQuantity })
      }

      if ((inputMode === 'textarea' || inputMode === 'both') && inputValue) {
        const lines = inputValue.split('\n').filter((line) => line.trim())
        lines.forEach((line) => {
          // Support formats: "SKU quantity" or "SKU,quantity"
          const parts = line.trim().split(/[\s,]+/)
          if (parts.length >= 2) {
            const sku = parts[0]
            const quantity = parseInt(parts[1], 10)
            if (sku && !isNaN(quantity) && quantity > 0) {
              items.push({ sku, quantity })
            }
          }
        })
      }

      if (items.length === 0) {
        setMessage({ type: 'error', text: 'Voer minimaal één product in' })
        setIsLoading(false)
        return
      }

      // Fetch products from API and add to cart
      let addedCount = 0
      let notFoundCount = 0

      for (const item of items) {
        try {
          // Fetch product by SKU
          const response = await fetch(`/api/products?where[sku][equals]=${encodeURIComponent(item.sku)}&limit=1`)
          const data = await response.json()

          if (data.docs && data.docs.length > 0) {
            const product = data.docs[0]

            // Add to cart with specified quantity
            for (let i = 0; i < item.quantity; i++) {
              addItem({
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price || 0,
                stock: product.stock || 999,
                sku: product.sku,
              })
            }
            addedCount++
          } else {
            notFoundCount++
            console.warn(`Product not found: ${item.sku}`)
          }
        } catch (error) {
          console.error(`Error fetching product ${item.sku}:`, error)
          notFoundCount++
        }
      }

      if (addedCount > 0) {
        setMessage({
          type: 'success',
          text: `${addedCount} product(en) toegevoegd aan winkelwagen!${notFoundCount > 0 ? ` (${notFoundCount} niet gevonden)` : ''}`,
        })
        setInputValue('')
        setSingleSKU('')
        setSingleQuantity(1)
      } else {
        setMessage({
          type: 'error',
          text: 'Geen van de opgegeven artikelnummers kon worden gevonden.',
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Er ging iets mis. Probeer opnieuw.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setMessage(null)

    try {
      const text = await file.text()
      setInputValue(text)
      setMessage({ type: 'success', text: 'CSV bestand geladen!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Fout bij laden CSV bestand' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
          {intro && <p className="text-lg text-gray-600 mb-8">{intro}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Single line input */}
            {(inputMode === 'single' || inputMode === 'both') && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Package" size={20} />
                  Enkel Product Toevoegen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artikelnummer
                    </label>
                    <input
                      type="text"
                      value={singleSKU}
                      onChange={(e) => setSingleSKU(e.target.value)}
                      placeholder="Bijv. BV-001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aantal</label>
                    <input
                      type="number"
                      value={singleQuantity}
                      onChange={(e) => setSingleQuantity(parseInt(e.target.value, 10) || 1)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Textarea bulk input */}
            {(inputMode === 'textarea' || inputMode === 'both') && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="List" size={20} />
                  Bulk Bestelling
                </h3>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholderText}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Formaat: <code className="bg-white px-2 py-1 rounded">artikelnr aantal</code> per
                  regel
                </p>
              </div>
            )}

            {/* CSV Upload */}
            {showUpload && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Upload" size={20} />
                  CSV Bestand Uploaden
                </h3>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100
                    cursor-pointer"
                />
                {uploadHelpText && <p className="text-sm text-gray-500 mt-2">{uploadHelpText}</p>}
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                    size={20}
                  />
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Bezig...
                </>
              ) : (
                <>
                  <Icon name="ShoppingCart" size={20} />
                  {submitButtonText}
                </>
              )}
            </button>
          </form>

          {/* Order Lists Section */}
          {showOrderLists && (
            <div className="mt-12 border-t border-gray-200 pt-12">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Star" size={20} />
                Mijn Bestellijsten
              </h3>
              <p className="text-gray-600 mb-6">
                Gebruik uw opgeslagen bestellijsten voor snelle herbestellingen
              </p>
              {/* TODO: Fetch and display user's order lists */}
              <div className="text-center py-8 text-gray-500">
                <Icon name="Inbox" size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Nog geen bestellijsten opgeslagen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
