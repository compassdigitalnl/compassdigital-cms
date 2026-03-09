export interface CheckoutSummaryProps {
  shippingCost?: number
  discount?: number
  freeShippingThreshold?: number
  couponCode?: string
  onRemoveCoupon?: () => void
  className?: string
}
