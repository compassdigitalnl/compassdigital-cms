import React from 'react'
import type { Product } from '@payload-shop/types'
import { ProductCard } from './ProductCard'

export interface ProductGridProps {
  products: Partial<Product>[]
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  layout?: 'grid' | 'list'
  loading?: boolean
  emptyMessage?: string
  showQuickView?: boolean
  showCompare?: boolean
  showWishlist?: boolean
  onAddToCart?: (product: Partial<Product>) => void
  onQuickView?: (product: Partial<Product>) => void
}

/**
 * ProductGrid Component
 * Responsive grid layout for displaying multiple products
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 4,
  gap = 'md',
  layout = 'grid',
  loading = false,
  emptyMessage = 'Geen producten gevonden',
  showQuickView,
  showCompare,
  showWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const gridColsClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6',
  }

  if (loading) {
    return (
      <div
        className={`grid ${gridColsClasses[columns]} ${gapClasses[gap]}`}
        data-testid="product-grid-loading"
      >
        {[...Array(columns * 2)].map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12" data-testid="product-grid-empty">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-4`} data-testid="product-grid-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            layout="list"
            showQuickView={showQuickView}
            showCompare={showCompare}
            showWishlist={showWishlist}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`grid ${gridColsClasses[columns]} ${gapClasses[gap]}`}
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="grid"
          showQuickView={showQuickView}
          showCompare={showCompare}
          showWishlist={showWishlist}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  )
}
