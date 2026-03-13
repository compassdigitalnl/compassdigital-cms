/**
 * B-13 ProductGrid Client Wrapper
 *
 * Client component that renders ProductCard instances from server-mapped data.
 * Bridges the server-component ProductGrid fetcher with the client-component ProductCard.
 * Includes add-to-cart, quick view, and wishlist interactivity.
 */
'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ProductCard } from '@/branches/ecommerce/shared/components/products/ProductCard'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/shared/components/ui/AddToCartToast'
import type { ProductCardProps } from '@/branches/ecommerce/shared/components/products/ProductCard/types'
import type { QuickViewProduct } from '@/branches/ecommerce/b2c/components/products/QuickViewModal'

const QuickViewModal = dynamic(
  () => import('@/branches/ecommerce/b2c/components/products/QuickViewModal/Component').then(m => ({ default: m.QuickViewModal })),
  { ssr: false },
)

interface ProductGridCardsProps {
  products: ProductCardProps[]
  layout: 'grid-3' | 'grid-4' | 'list'
}

const gridClasses: Record<string, string> = {
  'grid-3': 'grid grid-cols-2 md:grid-cols-3 gap-6',
  'grid-4': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
  list: 'flex flex-col gap-4',
}

export function ProductGridCards({ products, layout }: ProductGridCardsProps) {
  const gridClass = gridClasses[layout] || gridClasses['grid-4']
  const variant = layout === 'list' ? 'list' : 'grid'

  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)

  const handleAddToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      const product = products.find(p => p.id === productId)
      if (!product || product.price == null) return

      addItem({
        id: Number(product.id) || product.id,
        title: product.name,
        slug: product.slug,
        price: product.price,
        unitPrice: product.price,
        quantity,
        stock: product.stock ?? 0,
        sku: product.sku || undefined,
        image: product.image?.url || undefined,
        backordersAllowed: product.stockStatus === 'on-backorder',
      })

      showToast({
        id: product.id,
        name: product.name,
        image: product.image?.url || undefined,
        quantity,
        price: product.price,
      })
    },
    [products, addItem, showToast],
  )

  const handleQuickView = useCallback(
    (productId: string) => {
      const product = products.find(p => p.id === productId)
      if (!product) return

      const stockStatus = product.stockStatus === 'in-stock' ? 'in_stock' as const
        : product.stockStatus === 'low' ? 'low_stock' as const
        : product.stockStatus === 'on-backorder' ? 'pre_order' as const
        : 'out_of_stock' as const

      setQuickViewProduct({
        id: product.id,
        name: product.name,
        brand: product.brand?.name || undefined,
        sku: product.sku || undefined,
        image: product.image?.url || '',
        imageAlt: product.image?.alt || product.name,
        stock: {
          status: stockStatus,
          quantity: product.stock ?? 0,
        },
        price: product.price ?? 0,
        unit: product.unit || undefined,
        slug: product.slug || undefined,
      })
    },
    [products],
  )

  const handleWishlistToggle = useCallback(
    async (productId: string) => {
      try {
        await fetch('/api/account/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: Number(productId) || productId }),
        })
      } catch {
        // Silently fail for non-logged-in users — localStorage fallback
        const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
        if (wishlist.includes(productId)) {
          localStorage.setItem('wishlist', JSON.stringify(wishlist.filter(id => id !== productId)))
        } else {
          localStorage.setItem('wishlist', JSON.stringify([...wishlist, productId]))
        }
      }
    },
    [],
  )

  return (
    <>
      <div className={gridClass}>
        {products.map((product) => {
          const canAddToCart = product.stockStatus !== 'out' && product.price != null

          return (
            <ProductCard
              key={product.id}
              {...product}
              variant={variant}
              href={`/shop/${product.slug}`}
              onAddToCart={canAddToCart ? handleAddToCart : undefined}
              onQuickView={() => handleQuickView(product.id)}
              onWishlistToggle={() => handleWishlistToggle(product.id)}
            />
          )
        })}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(productId, _variantId, quantity) => {
            handleAddToCart(productId, quantity)
            setQuickViewProduct(null)
          }}
        />
      )}
    </>
  )
}
