// Re-export shared types from QuickOrderTable
export type { StaffelHint, QuickOrderRow as QuickOrderRowData } from '../QuickOrderTable/types'

export interface Product {
  id: string
  name: string
  sku: string
  price: number
}

export interface QuickOrderRowProps {
  row: {
    id: string
    productQuery: string
    productId?: string
    productName?: string
    sku?: string
    quantity: number
    unitPrice: number
    total: number
    taxClass?: 'standard' | 'reduced' | 'zero'
    staffelHint?: {
      quantityNeeded: number
      nextTierPrice: number
      discount: number
    }
  }
  onUpdate: (rowId: string, updates: Partial<QuickOrderRowProps['row']>) => void
  onDelete: (rowId: string) => void
  onProductSearch?: (rowId: string, query: string) => void
  showAutocomplete?: boolean
  autocompleteResults?: Product[]
  onAutocompleteSelect?: (rowId: string, product: Product) => void
  className?: string
}
