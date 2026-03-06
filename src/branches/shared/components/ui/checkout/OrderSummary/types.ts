export interface SummarySection {
  label: string
  rows: SummaryRow[]
}

export interface SummaryRow {
  label: string
  value: string
  variant?: 'default' | 'muted' | 'success'
}

export interface OrderSummaryProps {
  title?: string
  subtitle?: string
  sections: SummarySection[]
  totalLabel?: string
  totalValue: string
  totalSubtext?: string
  confirmLabel: string
  confirmHref?: string
  onConfirm?: () => void
  confirmNote?: string
  children?: React.ReactNode
  className?: string
}
