import type { OrderList, QuickAddProduct } from '@/branches/ecommerce/components/account/order-lists'
import type { DragEndEvent } from '@dnd-kit/core'

export interface OrderListDetailTemplateProps {
  // Data
  list: OrderList
  listId: string

  // UI state
  selectedItems: Set<string>
  showBulkBar: boolean
  tableFilter: string
  sortBy: string
  quickAddQuery: string
  quickAddFocused: boolean
  quickAddResults: QuickAddProduct[]
  quickAddLoading: boolean
  showBarcodeScanner: boolean

  // Computed
  filteredItems: OrderList['items']
  stats: {
    total: number
    inStock: number
    limited: number
    totalValue: number
  }
  discount: number
  expectedTotal: number

  // Handlers
  onSelectItem: (id: string) => void
  onSelectAll: () => void
  onQuantityChange: (id: string, delta: number) => void
  onDeleteItem: (id: string) => void
  onAddToCart: (id: string) => void
  onAddAllToCart: () => void
  onBulkAction: (action: string) => void
  onClearSelection: () => void
  onDragEnd: (event: DragEndEvent) => void
  onTableFilterChange: (value: string) => void
  onSortChange: (value: string) => void
  onQuickAddQueryChange: (value: string) => void
  onQuickAddFocus: () => void
  onQuickAddBlur: () => void
  onAddProductToList: (product: QuickAddProduct) => void
  onScanBarcode: () => void
  onBarcodeScan: (barcode: string) => void
  onCloseBarcodeScanner: () => void

  // Header actions
  onShare: () => void
  onDuplicate: () => void
  onExport: () => void
  onPrint: () => void

  // Summary actions
  onNotesChange: (value: string) => void
  onRequestQuote: () => void
  notesValue: string
}

export type { OrderList, QuickAddProduct }
