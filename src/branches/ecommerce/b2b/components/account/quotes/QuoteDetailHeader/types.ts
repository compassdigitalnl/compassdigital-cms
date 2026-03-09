export interface QuoteDetailHeaderProps {
  quoteNumber: string
  status: string
  submittedAt: string
  validUntil: string | null
  convertedToOrder: any
  isExpired: boolean
  canAccept: boolean
  canReject: boolean
  onAccept: () => void
  onReject: () => void
  accepting: boolean
}
