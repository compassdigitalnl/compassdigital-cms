export interface OrderListProduct {
  id: string
  name: string
  emoji?: string
  price: number
}

export interface OrderListItem {
  id: string
  product: OrderListProduct
  defaultQuantity: number
  notes?: string
}

export interface OrderList {
  id: string
  name: string
  icon: string
  color: string
  isPinned: boolean
  itemCount: number
  items: OrderListItem[]
  shareWith: Array<{ user: string; canEdit: boolean }>
  updatedAt: string
  createdAt: string
}

export interface OrderListsTemplateProps {
  lists: OrderList[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onAddToCart: (listId: string, listName: string) => void
  onDeleteList?: (listId: string) => void
  onDuplicateList?: (listId: string) => void
  onTogglePin?: (listId: string) => void
}
