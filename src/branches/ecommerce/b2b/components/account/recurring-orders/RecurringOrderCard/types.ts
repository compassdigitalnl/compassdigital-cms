import type { RecurringOrder } from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/RecurringOrdersTemplate/types'

export interface RecurringOrderCardProps {
  order: RecurringOrder
  onTogglePause: (id: string, currentStatus: string) => void
  onDelete: (id: string) => void
}
