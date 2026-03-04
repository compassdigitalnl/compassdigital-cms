'use client'

import React from 'react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { TaxClass } from '@/lib/pricing/calculatePrice'

export const Price: React.FC<{
  amount: number | null | undefined
  taxClass?: TaxClass
  className?: string
  currencyCodeClassName?: string
}> = ({ amount, taxClass, className, currencyCodeClassName }) => {
  const { formatPriceFull } = usePriceMode()
  if (amount == null) return null
  return (
    <span className={className}>
      {formatPriceFull(amount, taxClass)}
    </span>
  )
}
