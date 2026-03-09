export interface StaffelHint {
  quantityNeeded: number
  nextTierPrice: number
  discount: number
}

export interface QuickOrderRow {
  id: string
  productQuery: string
  productId?: string
  productName?: string
  sku?: string
  quantity: number
  unitPrice: number
  total: number
  staffelHint?: StaffelHint
}

export interface QuickOrderTableProps {
  rows: QuickOrderRow[]
  onRowChange: (rowId: string, field: string, value: any) => void
  onRowDelete: (rowId: string) => void
  onRowAdd: () => void
  onBulkAddToCart: () => void | Promise<void>
  loading?: boolean
  className?: string
}
