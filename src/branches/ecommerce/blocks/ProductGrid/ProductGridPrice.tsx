'use client'

import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { TaxClass } from '@/lib/pricing/calculatePrice'

interface ProductGridPriceProps {
  price: number | null | undefined
  compareAtPrice: number | null | undefined
  taxClass?: TaxClass
}

export function ProductGridPrice({ price, compareAtPrice, taxClass }: ProductGridPriceProps) {
  const { formatPriceStr } = usePriceMode()

  return (
    <>
      {price != null && (
        <div className="text-2xl font-bold text-gray-900">
          &euro;{formatPriceStr(price, taxClass)}
        </div>
      )}
      {compareAtPrice != null && price != null && compareAtPrice > price && (
        <div className="text-sm text-gray-400 line-through">
          &euro;{formatPriceStr(compareAtPrice, taxClass)}
        </div>
      )}
    </>
  )
}
