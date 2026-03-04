import type { GiftCard, GiftCardTransaction } from '@/branches/ecommerce/templates/account/GiftCardsTemplate/types'

export interface GiftCardListProps {
  giftCards: GiftCard[]
  transactions: GiftCardTransaction[]
  onSend: (id: number) => void
  onPrint: (id: number) => void
}
