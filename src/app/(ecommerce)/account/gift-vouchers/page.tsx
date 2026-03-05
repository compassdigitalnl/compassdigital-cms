'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import GiftCardsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import { toast } from '@/lib/toast'
import type {
  GiftCard,
  GiftCardTransaction,
  GiftCardBalanceSummary,
} from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate/types'

const EMPTY_BALANCE: GiftCardBalanceSummary = {
  totalBalance: 0,
  activeCount: 0,
  received: 0,
  sent: 0,
  totalSpent: 0,
  totalReceived: 0,
}

export default function GiftVouchersPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [transactions, setTransactions] = useState<GiftCardTransaction[]>([])
  const [balance, setBalance] = useState<GiftCardBalanceSummary>(EMPTY_BALANCE)
  const [redeemCode, setRedeemCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/account/gift-vouchers', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setGiftCards(data.docs || [])
        setTransactions(data.transactions || [])
        if (data.balance) setBalance(data.balance)
      }
    } catch (err) {
      console.error('Error fetching gift vouchers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return
    try {
      const res = await fetch('/api/account/gift-vouchers', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setRedeemCode('')
        fetchData()
      } else {
        toast.error(data.error || 'Code kon niet worden ingewisseld')
      }
    } catch {
      toast.error('Er is iets misgegaan. Probeer het later opnieuw.')
    }
  }

  const handleSend = async (id: number) => {
    try {
      const res = await fetch(`/api/account/gift-vouchers/${id}/send`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Verzoek om opnieuw te versturen is ontvangen')
      } else {
        toast.error('Versturen mislukt. Probeer het later opnieuw.')
      }
    } catch {
      toast.error('Er is iets misgegaan')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <GiftCardsTemplate
      giftCards={giftCards}
      transactions={transactions}
      balance={balance}
      redeemCode={redeemCode}
      onRedeemCodeChange={setRedeemCode}
      onRedeem={handleRedeem}
      onSend={handleSend}
      onPrint={handlePrint}
      isLoading={isLoading}
    />
  )
}
