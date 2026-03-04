'use client'

import React, { useState } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import GiftCardsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import type {
  GiftCard,
  GiftCardTransaction,
  GiftCardBalanceSummary,
} from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate/types'

// TODO: Replace mock data with real API calls
const MOCK_GIFT_CARDS: GiftCard[] = [
  {
    id: 1,
    code: 'GC-V8K2-M4N7',
    amount: 50,
    balance: 23.5,
    status: 'active',
    occasion: 'Verjaardag',
    occasionEmoji: '🎂',
    from: 'Lisa de Jong',
    purchasedAt: '2026-02-14',
    expiresAt: '2027-02-14',
    deliveryMethod: 'email',
  },
  {
    id: 2,
    code: 'GC-R3P9-K6T2',
    amount: 100,
    balance: 50,
    status: 'active',
    occasion: 'Kerst',
    occasionEmoji: '🎄',
    from: 'Team CompassDigital',
    purchasedAt: '2025-12-24',
    expiresAt: '2026-12-24',
    deliveryMethod: 'email',
  },
  {
    id: 3,
    code: 'GC-J5L1-N8W4',
    amount: 25,
    balance: 0,
    status: 'spent',
    occasion: 'Bedankt',
    occasionEmoji: '🙏',
    from: 'Pieter van Dam',
    purchasedAt: '2025-11-01',
    expiresAt: '2026-11-01',
  },
]

const MOCK_TRANSACTIONS: GiftCardTransaction[] = [
  {
    id: 'tx1',
    type: 'credit',
    description: 'Cadeaubon ontvangen van Lisa de Jong',
    date: '2026-02-14',
    code: 'GC-V8K2-M4N7',
    amount: 50,
  },
  {
    id: 'tx2',
    type: 'debit',
    description: 'Bestelling #DS-2026-0847',
    date: '2026-02-18',
    code: 'GC-V8K2-M4N7',
    amount: 26.5,
  },
  {
    id: 'tx3',
    type: 'credit',
    description: 'Cadeaubon ontvangen van Team CompassDigital',
    date: '2025-12-24',
    code: 'GC-R3P9-K6T2',
    amount: 100,
  },
  {
    id: 'tx4',
    type: 'debit',
    description: 'Bestelling #DS-2025-0612',
    date: '2026-01-02',
    code: 'GC-R3P9-K6T2',
    amount: 50,
  },
  {
    id: 'tx5',
    type: 'debit',
    description: 'Cadeaubon verzonden aan Anna Bakker',
    date: '2025-12-15',
    amount: 25,
  },
]

const MOCK_BALANCE: GiftCardBalanceSummary = {
  totalBalance: 73.5,
  activeCount: 2,
  received: 3,
  sent: 1,
  totalSpent: 76.5,
  totalReceived: 150,
}

export default function GiftVouchersPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const [redeemCode, setRedeemCode] = useState('')

  // TODO: Replace with real API call
  const handleRedeem = () => {
    if (!redeemCode.trim()) return
    console.log(`Redeeming code: ${redeemCode}`)
    alert(`Code "${redeemCode}" ingediend. (TODO: koppel aan API)`)
    setRedeemCode('')
  }

  // TODO: Replace with real API call
  const handleSend = (id: number) => {
    console.log(`Re-sending gift card ${id}`)
    alert('Cadeaubon verzonden!')
  }

  // TODO: Replace with real API call
  const handlePrint = (id: number) => {
    console.log(`Printing gift card ${id}`)
    alert('Print functionaliteit nog niet beschikbaar')
  }

  return (
    <GiftCardsTemplate
      giftCards={MOCK_GIFT_CARDS}
      transactions={MOCK_TRANSACTIONS}
      balance={MOCK_BALANCE}
      redeemCode={redeemCode}
      onRedeemCodeChange={setRedeemCode}
      onRedeem={handleRedeem}
      onSend={handleSend}
      onPrint={handlePrint}
    />
  )
}
