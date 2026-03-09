export interface OrderListSummaryProps {
  itemCount: number
  totalValue: number
  discount: number
  expectedTotal: number
  notes?: string
  onAddAllToCart: () => void
  onRequestQuote?: () => void
  onNotesChange?: (value: string) => void
}
