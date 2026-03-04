export type GiftCardStatus = 'active' | 'spent' | 'expired'
export type DeliveryMethod = 'email' | 'print' | 'post'
export type TransactionType = 'credit' | 'debit'

export interface GiftCard {
  id: number
  code: string
  amount: number
  balance: number
  status: GiftCardStatus
  occasion?: string
  occasionEmoji?: string
  from?: string
  recipientEmail?: string
  message?: string
  deliveryMethod?: DeliveryMethod
  purchasedAt: string
  expiresAt: string
}

export interface GiftCardTransaction {
  id: string
  type: TransactionType
  description: string
  date: string
  code?: string
  amount: number
}

export interface GiftCardBalanceSummary {
  totalBalance: number
  activeCount: number
  received: number
  sent: number
  totalSpent: number
  totalReceived: number
}

export interface GiftCardsTemplateProps {
  giftCards: GiftCard[]
  transactions: GiftCardTransaction[]
  balance: GiftCardBalanceSummary
  redeemCode: string
  onRedeemCodeChange: (code: string) => void
  onRedeem: () => void
  onSend: (id: number) => void
  onPrint: (id: number) => void
  isLoading?: boolean
}
