export interface QuickAddProduct {
  id: string
  title: string
  brand: string
  sku: string
  price: number
  stock: number
  stockStatus: string
}

export interface QuickAddSearchProps {
  query: string
  focused: boolean
  results: QuickAddProduct[]
  loading: boolean
  onQueryChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onAddProduct: (product: QuickAddProduct) => void
  onScanBarcode: () => void
}
