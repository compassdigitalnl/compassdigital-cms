'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/payload-types'
import { useCart } from '@/contexts/CartContext'

export function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem, items } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    // Add to cart using context
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        stock: product.stock || 0,
        sku: product.sku || undefined,
      })
    }

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setTimeout(() => {
      router.push('/cart')
    }, 300)
  }

  // Check if item is already in cart
  const cartItem = items.find((item) => item.id === product.id)
  const cartQuantity = cartItem?.quantity || 0

  const isOutOfStock = product.stock !== null && product.stock !== undefined && product.stock === 0

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock || 999}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isOutOfStock}
            className="w-20 h-10 text-center border border-gray-300 rounded-lg font-semibold disabled:opacity-50"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
          >
            +
          </button>
          {product.stock && quantity > product.stock && (
            <span className="text-sm text-red-600">Only {product.stock} available</span>
          )}
        </div>
      </div>

      {/* Cart Status */}
      {cartQuantity > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
          <p className="text-sm text-green-800">
            <strong>{cartQuantity}</strong> {cartQuantity === 1 ? 'item' : 'items'} already in cart
          </p>
        </div>
      )}

      {/* Add to Cart Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || (product.stock !== null && product.stock !== undefined && quantity + cartQuantity > product.stock)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              ✓ Added to Cart
            </span>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>Add to Cart • €{(product.price * quantity).toFixed(2)}</>
          )}
        </button>

        {!isOutOfStock && (
          <button
            onClick={handleBuyNow}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Quick Info */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Fast Shipping</span>
          </div>
        </div>
      )}
    </div>
  )
}
