'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'

interface ProductData {
  id: number | string
  slug: string
  title: string
  price: number
  stock: number
  sku?: string
  ean?: string
  image?: string
  parentProductId?: number | string
  parentProductTitle?: string
  minOrderQuantity?: number
  orderMultiple?: number
  maxOrderQuantity?: number
}

export function AddToCartButton({ product }: { product: ProductData }) {
  const { addItem } = useCart()
  const minQty = product.minOrderQuantity || 1
  const orderMultiple = product.orderMultiple || 1
  const [quantity, setQuantity] = useState(minQty)
  const [added, setAdded] = useState(false)

  const maxQuantity = product.maxOrderQuantity || product.stock || 10

  const handleIncrement = () => {
    let newQty = quantity + orderMultiple
    newQty = Math.min(newQty, maxQuantity)
    setQuantity(newQty)
  }

  const handleDecrement = () => {
    let newQty = quantity - orderMultiple
    newQty = Math.max(newQty, minQty)
    setQuantity(newQty)
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      ean: product.ean,
      image: product.image,
      parentProductId: product.parentProductId,
      parentProductTitle: product.parentProductTitle,
      minOrderQuantity: product.minOrderQuantity,
      orderMultiple: product.orderMultiple,
      maxOrderQuantity: product.maxOrderQuantity,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrement}
            className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= minQty}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Toegevoegd aan winkelwagen!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Toevoegen aan winkelwagen
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1">
          <strong>Totaal:</strong> €{(product.price * quantity).toFixed(2)}
        </p>
        {minQty > 1 && (
          <p className="text-amber-600 mb-1">Minimum bestelhoeveelheid: {minQty} stuks</p>
        )}
        {orderMultiple > 1 && (
          <p className="text-amber-600 mb-1">Bestelbaar in veelvouden van {orderMultiple}</p>
        )}
        {product.stock && <p className="text-gray-500">Maximaal {product.stock} beschikbaar</p>}
      </div>
    </div>
  )
}
