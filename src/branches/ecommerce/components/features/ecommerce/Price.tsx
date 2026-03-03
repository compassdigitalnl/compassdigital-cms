import React from 'react'

export const Price: React.FC<{
  amount: number | null | undefined
  className?: string
  currencyCodeClassName?: string
}> = ({ amount, className, currencyCodeClassName }) => {
  if (amount == null) return null
  return (
    <span className={className}>
      €{amount.toFixed(2)}
    </span>
  )
}
