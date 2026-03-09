export interface QuoteDetail {
  id: number
  quoteNumber: string
  status: string
  products: Array<{
    name: string
    sku: string | null
    quantity: number
    quotedUnitPrice: number | null
  }>
  companyName: string | null
  contactPerson: string | null
  email: string | null
  phone: string | null
  sector: string | null
  desiredDeliveryDate: string | null
  deliveryFrequency: string | null
  notes: string | null
  quotedPrice: number | null
  validUntil: string | null
  convertedToOrder: any
  acceptedAt: string | null
  rejectedAt: string | null
  rejectionReason: string | null
  submittedAt: string | null
  createdAt: string
}

export interface QuoteDetailTemplateProps {
  quote: QuoteDetail | null
  isLoading: boolean
  error: string | null
  accepting: boolean
  rejecting: boolean
  onAccept: () => void
  onReject: (reason: string) => void
}
