import React from 'react'

export interface AddOn {
  id: string
  label: string
  description?: string
  price: number
  required?: boolean
  selected: boolean
  icon?: React.ReactNode
}

export interface AddOnSelectorProps {
  addOns: AddOn[]
  onChange: (addOnId: string, selected: boolean) => void
  layout?: 'grid' | 'list'
  className?: string
}
