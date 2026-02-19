'use client'

import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight, Package } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Je winkelwagen is leeg</h1>
          <p className="text-gray-600 mb-6">
            Voeg producten toe aan je winkelwagen om te beginnen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Verder winkelen
          </Link>
        </div>
      </div>
    )
  }

  // Group items by parentProductId
  const groupedItems: {
    parentProduct: { id: number | string; title: string } | null
    items: CartItem[]
  }[] = []

  const itemsWithParent = items.filter((i) => i.parentProductId)
  const itemsWithoutParent = items.filter((i) => !i.parentProductId)

  // Group items by parent
  const parentGroups = new Map<number | string, CartItem[]>()
  itemsWithParent.forEach((item) => {
    const parentId = item.parentProductId!
    if (!parentGroups.has(parentId)) {
      parentGroups.set(parentId, [])
    }
    parentGroups.get(parentId)!.push(item)
  })

  // Add parent groups
  parentGroups.forEach((groupItems, parentId) => {
    groupedItems.push({
      parentProduct: {
        id: parentId,
        title: groupItems[0].parentProductTitle || `Grouped Product ${parentId}`,
      },
      items: groupItems,
    })
  })

  // Add ungrouped items
  if (itemsWithoutParent.length > 0) {
    groupedItems.push({
      parentProduct: null,
      items: itemsWithoutParent,
    })
  }

  const shipping = total >= 150 ? 0 : 9.95
  const subtotal = total
  const tax = total * 0.21
  const grandTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Winkelwagen</h1>
              <p className="text-gray-600 mt-1">
                {itemCount} product{itemCount !== 1 ? 'en' : ''} in je winkelwagen
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Verder winkelen
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {groupedItems.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Parent Product Header (if grouped) */}
                  {group.parentProduct && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-teal-700" />
                        <h3 className="font-semibold text-teal-900">
                          {group.parentProduct.title}
                        </h3>
                        <span className="text-sm text-teal-700">
                          ({group.items.length} product{group.items.length !== 1 ? 'en' : ''})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Group Items */}
                  <div className="bg-white rounded-lg shadow-sm border divide-y">
                    {group.items.map((item) => {
                      const unitPrice = item.unitPrice ?? item.price
                      const hasDiscount = item.unitPrice && item.unitPrice < item.price
                      const minQty = item.minOrderQuantity || 1
                      const multiple = item.orderMultiple || 1

                      return (
                        <div key={item.id} className="p-6">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/shop/${item.slug}`}
                                className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors"
                              >
                                {item.title}
                              </Link>

                              {/* SKU & EAN */}
                              <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                                {item.sku && <div>SKU: {item.sku}</div>}
                                {item.ean && <div>EAN: {item.ean}</div>}
                              </div>

                              {/* Price */}
                              <div className="mt-2">
                                <p className="text-lg font-bold text-gray-900">
                                  €{unitPrice.toFixed(2)}
                                  {hasDiscount && (
                                    <span className="ml-2 text-sm line-through text-gray-500">
                                      €{item.price.toFixed(2)}
                                    </span>
                                  )}
                                </p>
                                {hasDiscount && (
                                  <p className="text-sm text-green-600 font-medium">
                                    Staffelkorting: -€{(item.price - unitPrice).toFixed(2)} per stuk
                                  </p>
                                )}
                              </div>

                              {/* MOQ/Multiple Info */}
                              {(minQty > 1 || multiple > 1) && (
                                <div className="mt-2 text-xs text-amber-600 space-y-0.5">
                                  {minQty > 1 && <div>Min: {minQty} stuks</div>}
                                  {multiple > 1 && <div>Veelvoud van: {multiple}</div>}
                                </div>
                              )}

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - multiple)}
                                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= minQty}
                                  >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <span className="px-4 py-1 font-semibold text-gray-900 min-w-[50px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + multiple)}
                                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    disabled={
                                      item.maxOrderQuantity
                                        ? item.quantity >= item.maxOrderQuantity
                                        : item.quantity >= item.stock
                                    }
                                  >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Verwijderen
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">
                                €{(unitPrice * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-500 mt-1">
                                  €{unitPrice.toFixed(2)} per stuk
                                </p>
                              )}
                              {hasDiscount && (
                                <p className="text-sm text-green-600 font-medium mt-1">
                                  Bespaard: €
                                  {((item.price - unitPrice) * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overzicht</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotaal</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Verzending</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-gray-600 bg-teal-50 p-3 rounded-lg">
                    Voeg nog €{(150 - total).toFixed(2)} toe voor gratis verzending
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>BTW (21%)</span>
                  <span className="font-medium">€{tax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Totaal</span>
                    <span className="text-2xl font-bold text-gray-900">
                      €{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors mb-4"
              >
                Afrekenen
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Verder winkelen
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Veilig betalen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Gratis verzending vanaf €150</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Snelle levering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
