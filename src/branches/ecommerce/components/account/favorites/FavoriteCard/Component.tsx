'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, Eye, Package } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { FavoriteCardProps } from './types'

export function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const { formatPriceStr, vatLabel } = usePriceMode()
  const product = favorite.product
  const title = typeof product === 'object' ? (product?.title || product?.name || 'Product') : 'Product'
  const sku = typeof product === 'object' ? product?.sku : undefined
  const price = typeof product === 'object' ? product?.price : 0
  const slug = typeof product === 'object' ? product?.slug : ''
  const image = typeof product === 'object' ? product?.featuredImage : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {image && typeof image === 'object' && image.url ? (
          <img src={image.url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        <button
          onClick={() => onRemove(favorite.id)}
          className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
          title="Verwijder uit favorieten"
        >
          <Heart className="w-4 h-4 text-red-600 fill-red-600" />
        </button>
      </div>

      <div className="p-4">
        <Link href={slug ? `/product/${slug}` : '#'} className="hover:text-teal-600 transition-colors">
          <h3 className="font-bold text-sm mb-1 line-clamp-2">{title}</h3>
        </Link>
        {sku && <div className="text-xs text-gray-500 font-mono mb-3">{sku}</div>}
        {price > 0 && (
          <div className="mb-4">
            <div className="text-xl font-bold text-gray-900">€{formatPriceStr(price, (typeof product === 'object' ? product?.taxClass : undefined) as any)}</div>
            <div className="text-xs text-gray-500">{vatLabel}</div>
          </div>
        )}
        <div className="space-y-2">
          <Link
            href={slug ? `/product/${slug}` : '#'}
            className="btn btn-sm btn-outline-neutral w-full flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Bekijk
          </Link>
        </div>
      </div>
    </div>
  )
}
