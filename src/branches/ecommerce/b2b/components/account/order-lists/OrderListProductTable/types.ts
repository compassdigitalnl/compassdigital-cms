import { DragEndEvent } from '@dnd-kit/core'
import type { OrderListItem } from '../OrderListHeader/types'

export interface OrderListProductTableProps {
  items: OrderListItem[]
  selectedItems: Set<string>
  showBulkBar: boolean
  tableFilter: string
  sortBy: string
  onSelectItem: (id: string) => void
  onSelectAll: () => void
  onQuantityChange: (id: string, delta: number) => void
  onDeleteItem: (id: string) => void
  onAddToCart: (id: string) => void
  onDragEnd: (event: DragEndEvent) => void
  onTableFilterChange: (value: string) => void
  onSortChange: (value: string) => void
  onBulkAction: (action: string) => void
  onClearSelection: () => void
}

export type { OrderListItem }
