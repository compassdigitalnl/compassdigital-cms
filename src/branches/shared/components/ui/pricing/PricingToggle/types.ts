export interface PricingToggleProps {
  isYearly: boolean
  onToggle: (yearly: boolean) => void
  savingsLabel?: string
  monthlyLabel?: string
  yearlyLabel?: string
  className?: string
}
