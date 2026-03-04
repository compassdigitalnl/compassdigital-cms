export interface RetourItem {
  id: string
  title: string
  sku?: string
  quantity: number
  maxQuantity: number
  selected: boolean
  reason?: string
}

export interface RetourTemplateProps {
  orderId: string
  orderNumber: string
  items: RetourItem[]
  onSubmit: (data: {
    items: Array<{ itemId: string; quantity: number; reason: string }>
  }) => Promise<void>
  isLoading?: boolean
}
