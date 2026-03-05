import type { OrderDetail } from '@/branches/ecommerce/templates/account/AccountTemplate1/OrderDetailTemplate/types'

export interface OrderSummaryCardProps {
  order: OrderDetail
  onReorder?: () => void
}
