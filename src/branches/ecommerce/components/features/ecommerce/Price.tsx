import React from 'react'

export const Price: React.FC<{ amount: number; className?: string }> = ({ amount, className }) => {
  return (
    <span className={className}>
      €{amount.toFixed(2)}
    </span>
  )
}
