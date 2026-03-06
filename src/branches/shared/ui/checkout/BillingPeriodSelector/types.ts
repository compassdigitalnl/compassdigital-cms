export interface BillingOption {
  id: string
  label: string
  price: string
  subtitle?: string
  savingsLabel?: string
}

export interface BillingPeriodSelectorProps {
  options: BillingOption[]
  selectedId: string
  onSelect: (id: string) => void
  savingsNote?: string
  className?: string
}
