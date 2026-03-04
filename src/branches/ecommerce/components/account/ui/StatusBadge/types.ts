import type { OrderStatusInfo } from '@/utilities/formatOrderStatus'

export interface StatusBadgeProps {
  status: string
  label?: string
  statusInfo?: OrderStatusInfo
  className?: string
}
