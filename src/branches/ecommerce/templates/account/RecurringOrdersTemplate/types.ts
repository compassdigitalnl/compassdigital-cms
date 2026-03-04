export interface RecurringOrder {
  id: string
  name: string
  frequency: string
  frequencyLabel: string
  nextDelivery?: string
  items?: any[]
  total: number
  status: string
  createdAt: string
}

export interface RecurringOrdersTemplateProps {
  recurringOrders: RecurringOrder[]
  onTogglePause: (id: string, currentStatus: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}
