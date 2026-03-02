import React from 'react'

export const Price: React.FC<{
  amount: number
  className?: string
  currencyCodeClassName?: string
}> = ({ amount, className, currencyCodeClassName }) => {
  return (
    <span className={className}>
      €{amount.toFixed(2)}
    </span>
  )
}
