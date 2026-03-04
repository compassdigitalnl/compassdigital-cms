import type { GiftCard, GiftCardTransaction } from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate/types'

export interface GiftCardListProps {
  giftCards: GiftCard[]
  transactions: GiftCardTransaction[]
  onSend: (id: number) => void
  onPrint: (id: number) => void
}
