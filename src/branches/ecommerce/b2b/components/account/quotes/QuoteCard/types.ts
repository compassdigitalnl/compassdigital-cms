export interface QuoteSummary {
  id: number
  quoteNumber: string
  status: string
  products: Array<{ name: string; quantity: number }>
  quotedPrice: number | null
  validUntil: string | null
  companyName: string | null
  createdAt: string
}

export interface QuoteCardProps {
  quote: QuoteSummary
}
