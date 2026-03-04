import type { RecurringOrder } from '@/branches/ecommerce/templates/account/RecurringOrdersTemplate/types'

export interface RecurringOrderCardProps {
  order: RecurringOrder
  onTogglePause: (id: string, currentStatus: string) => void
  onDelete: (id: string) => void
}
