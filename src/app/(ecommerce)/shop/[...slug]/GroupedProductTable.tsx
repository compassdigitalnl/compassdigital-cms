'use client'

import { useState, useMemo } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/payload-types'

interface GroupedProductTableProps {
  parentProduct: {
    id: number | string
    title: string
  }
  childProducts: Array<{
    product: string | Product
    sortOrder?: number | null
    isDefault?: boolean | null
  }>
}

interface ProductSelection {
  product: Product
  quantity: number
  selected: boolean
}

export function GroupedProductTable({ parentProduct, childProducts }: GroupedProductTableProps) {
  const { addGroupedItems } = useCart()

  // Initialize selections with defaults
  const [selections, setSelections] = useState<ProductSelection[]>(() => {
    return childProducts
      .map((child) => {
        const product = typeof child.product === 'object' ? child.product : null
        if (!product || product.status !== 'published') return null

        const minQty = product.minOrderQuantity || 1
        const isDefault = child.isDefault || false

        return {
          product,
          quantity: minQty,
          selected: isDefault,
        }
      })
      .filter((item): item is ProductSelection => item !== null)
      .sort((a, b) => {
        const aIdx = childProducts.findIndex((c) => {
          const p = typeof c.product === 'object' ? c.product : null
          return p && p.id === a.product.id
        })
        const bIdx = childProducts.findIndex((c) => {
          const p = typeof c.product === 'object' ? c.product : null
          return p && p.id === b.product.id
        })
        return (
          (childProducts[aIdx]?.sortOrder || 0) - (childProducts[bIdx]?.sortOrder || 0) ||
          aIdx - bIdx
        )
      })
  })

  // Calculate subtotal for selected items
  const subtotal = useMemo(() => {
    return selections
      .filter((s) => s.selected)
      .reduce((sum, s) => sum + s.product.price * s.quantity, 0)
  }, [selections])

  const selectedCount = selections.filter((s) => s.selected).length

  const toggleSelection = (productId: string | number) => {
    setSelections((prev) =>
      prev.map((s) => (s.product.id === productId ? { ...s, selected: !s.selected } : s)),
    )
  }

  const updateQuantity = (productId: string | number, delta: number) => {
    setSelections((prev) =>
      prev.map((s) => {
        if (s.product.id !== productId) return s

        let newQty = s.quantity + delta
        const minQty = s.product.minOrderQuantity || 1
        const multiple = s.product.orderMultiple || 1
        const maxQty = s.product.maxOrderQuantity || s.product.stock || 9999

        // Ensure minimum
        newQty = Math.max(newQty, minQty)

        // Ensure multiple
        if (multiple > 1) {
          newQty = Math.round(newQty / multiple) * multiple
          if (newQty < minQty) {
            newQty = multiple
          }
        }

        // Ensure max and stock
        newQty = Math.min(newQty, maxQty, s.product.stock || 9999)

        return { ...s, quantity: newQty }
      }),
    )
  }

  const handleAddToCart = () => {
    const selectedItems = selections
      .filter((s) => s.selected)
      .map((s) => {
        const imageUrl =
          typeof s.product.images?.[0] === 'object' && s.product.images[0] !== null
            ? s.product.images[0].url
            : undefined

        return {
          id: s.product.id,
          slug: s.product.slug!,
          title: s.product.title,
          price: s.product.price,
          stock: s.product.stock || 0,
          sku: s.product.sku || undefined,
          ean: s.product.ean || undefined,
          image: imageUrl,
          quantity: s.quantity,
          parentProductId: parentProduct.id,
          parentProductTitle: parentProduct.title,
          minOrderQuantity: s.product.minOrderQuantity || undefined,
          orderMultiple: s.product.orderMultiple || undefined,
          maxOrderQuantity: s.product.maxOrderQuantity || undefined,
        }
      })

    if (selectedItems.length > 0) {
      addGroupedItems(selectedItems)
      alert(`${selectedItems.length} product(en) toegevoegd aan winkelwagen!`)
    }
  }

  const handleAddAll = () => {
    setSelections((prev) => prev.map((s) => ({ ...s, selected: true })))
  }

  if (selections.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">Geen sub-producten beschikbaar.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selections.every((s) => s.selected)}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setSelections((prev) => prev.map((s) => ({ ...s, selected: checked })))
                  }}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                SKU / EAN
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Prijs</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Voorraad
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Aantal
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Subtotaal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selections.map((selection) => {
              const imageUrl =
                typeof selection.product.images?.[0] === 'object' &&
                selection.product.images[0] !== null
                  ? selection.product.images[0].url
                  : null

              const isInStock =
                !selection.product.trackStock ||
                selection.product.stockStatus === 'in-stock' ||
                (selection.product.stock !== undefined && selection.product.stock > 0)

              return (
                <tr
                  key={selection.product.id}
                  className={`hover:bg-gray-50 transition-colors ${!selection.selected ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selection.selected}
                      onChange={() => toggleSelection(selection.product.id)}
                      disabled={!isInStock}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={selection.product.title}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{selection.product.title}</p>
                        {selection.product.shortDescription && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {selection.product.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {selection.product.sku && <div>SKU: {selection.product.sku}</div>}
                      {selection.product.ean && <div>EAN: {selection.product.ean}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900">
                      €{selection.product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {isInStock ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700">
                            {selection.product.stock ? `${selection.product.stock} stuks` : 'Op voorraad'}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-700">Uitverkocht</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(selection.product.id, -1)}
                        disabled={!selection.selected || !isInStock}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={selection.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          updateQuantity(selection.product.id, val - selection.quantity)
                        }}
                        disabled={!selection.selected || !isInStock}
                        className="w-16 text-center border rounded px-2 py-1 disabled:bg-gray-100"
                        min={selection.product.minOrderQuantity || 1}
                        max={selection.product.maxOrderQuantity || selection.product.stock}
                        step={selection.product.orderMultiple || 1}
                      />
                      <button
                        onClick={() => updateQuantity(selection.product.id, 1)}
                        disabled={!selection.selected || !isInStock}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {selection.product.minOrderQuantity && selection.product.minOrderQuantity > 1 && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Min: {selection.product.minOrderQuantity}
                      </p>
                    )}
                    {selection.product.orderMultiple && selection.product.orderMultiple > 1 && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Veelvoud van: {selection.product.orderMultiple}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {selection.selected && (
                      <span className="font-semibold text-gray-900">
                        €{(selection.product.price * selection.quantity).toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with actions */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{selectedCount} product(en) geselecteerd</p>
            <button
              onClick={handleAddAll}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1"
            >
              Alles selecteren
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Totaal</p>
              <p className="text-2xl font-bold text-gray-900">€{subtotal.toFixed(2)}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={selectedCount === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Geselecteerde toevoegen ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
