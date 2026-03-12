/**
 * B-13 ProductGrid Client Wrapper
 *
 * Client component that renders ProductCard instances from server-mapped data.
 * Bridges the server-component ProductGrid fetcher with the client-component ProductCard.
 */
'use client'

import React from 'react'
import { ProductCard } from '@/branches/ecommerce/shared/components/products/ProductCard'
import type { ProductCardProps } from '@/branches/ecommerce/shared/components/products/ProductCard/types'

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

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          variant={variant}
          href={`/shop/${product.slug}`}
        />
      ))}
    </div>
  )
}
