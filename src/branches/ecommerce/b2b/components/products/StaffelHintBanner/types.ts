export type StaffelHintVariant = 'default' | 'success' | 'compact'

export interface StaffelHintTier {
  quantity: number
  discount: number // percentage
}

export interface StaffelHintBannerProps {
  currentQuantity: number
  nextTier: StaffelHintTier
  variant?: StaffelHintVariant
  achieved?: boolean
  className?: string
  customMessage?: string
}
