export interface SummaryLineItem {
  label: string
  value: string
  isExtra?: boolean
}

export interface BookingSummaryProps {
  eventName: string
  eventCategory?: string
  eventIcon?: string
  eventRating?: number
  eventReviewCount?: number
  date?: string
  time?: string
  duration?: string
  persons?: number
  lineItems: SummaryLineItem[]
  total: number
  vatNote?: string
  pricePerPerson?: number
  pricePerPersonNote?: string
  guarantees?: string[]
  onConfirm?: () => void
  onRequestQuote?: () => void
  className?: string
}
