import type { LucideIcon } from 'lucide-react'

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'invoice'
export type DeliveryIcon = 'truck' | 'package' | 'plane'
export type StatusBadgeVariant = 'paid' | 'pending' | 'failed'

export interface DeliveryDetails {
  label?: string // Default: "Verwachte levering"
  value: string // e.g., "Morgen"
  subtitle: string // e.g., "Voor 23:59 uur"
  icon?: DeliveryIcon // Default: "truck"
}

export interface PaymentDetails {
  label?: string // Default: "Betaalstatus"
  value: string // e.g., "Betaald"
  subtitle: string // e.g., "Via iDEAL"
  status: PaymentStatus
  badge?: {
    text: string
    variant: StatusBadgeVariant
  }
}

export interface TotalDetails {
  label?: string // Default: "Totaalbedrag"
  value: number // Amount in cents (e.g., 7519 = €75.19)
  subtitle?: string // Default: "Incl. BTW"
  currency?: string // Default: "€"
}

export interface OrderDetailsCardProps {
  delivery: DeliveryDetails
  payment: PaymentDetails
  total: TotalDetails
  className?: string
}
