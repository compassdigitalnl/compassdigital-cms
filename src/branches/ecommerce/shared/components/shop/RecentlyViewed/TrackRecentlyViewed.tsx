'use client'

import { useEffect } from 'react'
import { addToRecentlyViewed, type RecentlyViewedProduct } from './RecentlyViewed'

export function TrackRecentlyViewed({ product }: { product: RecentlyViewedProduct }) {
  useEffect(() => {
    addToRecentlyViewed(product)
  }, [product])

  return null
}
