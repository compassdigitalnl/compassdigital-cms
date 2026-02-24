'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useMiniCart } from './MiniCartProvider'
import {
  ShoppingCart,
  X,
  Truck,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  CreditCard,
} from 'lucide-react'

const CROSS_SELL_PRODUCTS = [
  {
    id: 'cross-1',
    emoji: '🧴',
    name: 'Handcrème Sensitive',
    price: 6.95,
  },
  {
    id: 'cross-2',
    emoji: '🧼',
    name: 'Desinfectie Gel 500ml',
    price: 8.95,
  },
]

export function MiniCart() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalItems, subtotal, freeShippingProgress, addItem } = useMiniCart()

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, closeCart])

  const freeShippingRemaining = Math.max(0, 50 - subtotal)
  const hasFreeShipping = freeShippingProgress >= 100

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[400] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[420px] max-w-[90vw] bg-white z-[410] flex flex-col shadow-2xl transition-transform duration-350 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-teal-600" />
              Winkelwagen
            </h2>
            {totalItems > 0 && (
              <span className="bg-teal-50 text-teal-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4.5 h-4.5 text-gray-900" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-green-50 border-b border-green-100 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-900 font-semibold mb-1.5">
              <Truck className="w-3.5 h-3.5 text-green-600" />
              {hasFreeShipping ? (
                <span>
                  Je hebt <strong className="text-green-600">gratis verzending</strong>!
                </span>
              ) : (
                <span>
                  Nog <strong className="text-green-600">€{freeShippingRemaining.toFixed(2)}</strong>{' '}
                  voor gratis verzending
                </span>
              )}
            </div>
            <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold mb-1">Je winkelwagen is leeg</p>
              <p className="text-sm text-gray-500 mb-4">Begin met winkelen!</p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors"
              >
                Verder winkelen
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative flex gap-3.5 px-6 py-3.5 border-b border-gray-100 group hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image/Emoji */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-[32px] flex-shrink-0">
                    {item.emoji || (item.image && <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />)}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      {item.brand}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 leading-snug mt-0.5">
                      {item.name}
                    </div>
                    {item.variant && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.variant}</div>
                    )}

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-1.5 border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7.5 h-7.5 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-900" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7.5 h-7.5 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-900" />
                        </button>
                      </div>
                      <div className="text-base font-extrabold text-gray-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-5 w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              ))}

              {/* Cross-Sell Section */}
              {items.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                    Ook interessant
                  </div>
                  <div className="space-y-1.5">
                    {CROSS_SELL_PRODUCTS.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-teal-500 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                          {product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs font-extrabold text-gray-900">
                            €{product.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            addItem({
                              id: product.id,
                              emoji: product.emoji,
                              brand: 'Hartmann',
                              name: product.name,
                              price: product.price,
                            })
                          }
                          className="w-7.5 h-7.5 rounded-lg border-1.5 border-gray-200 hover:border-teal-600 hover:bg-teal-50 flex items-center justify-center transition-all flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-400 hover:text-teal-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer (Subtotal + Checkout) */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-200 flex-shrink-0 bg-white">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Subtotaal</span>
              <span className="text-xl font-extrabold text-gray-900">
                €{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-3.5">Verzendkosten worden berekend bij checkout</div>

            <Link
              href="/checkout/"
              onClick={closeCart}
              className="w-full h-12 bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg shadow-teal-200 mb-2.5"
            >
              <CreditCard className="w-4.5 h-4.5" />
              Afrekenen
            </Link>

            <button
              onClick={closeCart}
              className="w-full py-2.5 text-sm text-teal-600 font-semibold flex items-center justify-center gap-1.5 hover:underline"
            >
              Verder winkelen
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
