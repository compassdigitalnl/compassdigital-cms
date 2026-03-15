'use client'

import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { TaxClass } from '@/branches/ecommerce/shared/lib/pricing/calculatePrice'

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
        <div className="text-2xl font-bold text-navy">
          &euro;{formatPriceStr(price, taxClass)}
        </div>
      )}
      {compareAtPrice != null && price != null && compareAtPrice > price && (
        <div className="text-sm text-grey-mid line-through">
          &euro;{formatPriceStr(compareAtPrice, taxClass)}
        </div>
      )}
    </>
  )
}
