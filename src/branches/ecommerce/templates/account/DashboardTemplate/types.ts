import type { User } from '@/payload-types'

export interface DashboardStats {
  totalOrders: number
  ordersInTransit: number
  orderLists: number
  yearlySpend: number
}

export interface DashboardOrder {
  id: string
  orderNumber: string
  date: string
  status: string
  statusLabel: string
  total: number
  items: Array<{
    title: string
    sku?: string
    quantity: number
    product?: any
  }>
  trackingUrl?: string | null
}

export interface DashboardAddress {
  id: string
  type: string
  typeLabel: string
  isDefault: boolean
  name: string
  street: string
  postalCode: string
  city: string
  country?: string
}

export interface DashboardTemplateProps {
  user: User
  stats: DashboardStats
  recentOrders: DashboardOrder[]
  orderLists: any[]
  addresses: DashboardAddress[]
}
