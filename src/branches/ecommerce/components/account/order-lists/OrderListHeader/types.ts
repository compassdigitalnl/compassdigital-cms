import React from 'react'

export interface Product {
  id: string
  name: string
  brand: string
  sku: string
  emoji?: string
  price: number
  priceUnit: string
  size?: string
  stockCount: number
}

export interface OrderListItem {
  id: string
  product: Product
  quantity: number
  notes?: string
}

export interface OrderList {
  id: string
  name: string
  icon: string
  color: string
  isPinned: boolean
  items: OrderListItem[]
  shareWith: Array<{ user: string; canEdit: boolean }>
  notes?: string
  updatedAt: string
  createdAt: string
  createdBy: string
}

export interface ListStats {
  total: number
  inStock: number
  limited: number
  totalValue: number
}

export interface OrderListHeaderProps {
  list: OrderList
  stats: ListStats
  onAddAllToCart: () => void
  onShare?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onPrint?: () => void
}
