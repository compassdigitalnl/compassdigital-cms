import type { OrderStatusInfo } from '@/branches/ecommerce/lib/formatOrderStatus'

export interface StatusBadgeProps {
  status: string
  label?: string
  statusInfo?: OrderStatusInfo
  className?: string
}
