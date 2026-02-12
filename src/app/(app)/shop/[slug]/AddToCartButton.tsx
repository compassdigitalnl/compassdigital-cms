'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductData {
  id: number | string
  slug: string
  name: string
  price: number
  stock: number
  sku?: string
}

export function AddToCartButton({ product }: { product: ProductData }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const maxQuantity = product.stock || 10

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.name,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
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
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1">
          <strong>Total:</strong> €{(product.price * quantity).toFixed(2)}
        </p>
        {product.stock && (
          <p className="text-gray-500">Maximum {product.stock} available</p>
        )}
      </div>
    </div>
  )
}
