'use client'

import React from 'react'
import Link from 'next/link'
import { Gift, Plus } from 'lucide-react'
import { AccountLoadingSkeleton, AccountEmptyState } from '@/branches/ecommerce/shared/components/account/ui'
import { GiftCardBalance, GiftCardList, RedeemCodeInput } from '@/branches/ecommerce/b2c/components/account/gift-cards'
import type { GiftCardsTemplateProps } from './types'

export default function GiftCardsTemplate({
  giftCards,
  transactions,
  balance,
  redeemCode,
  onRedeemCodeChange,
  onRedeem,
  onSend,
  onPrint,
  isLoading,
}: GiftCardsTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
            Cadeaubonnen
          </h1>
          <p className="text-sm lg:text-base text-gray-500">
            Bekijk je saldo, wissel bonnen in en bekijk transacties
          </p>
        </div>
        <Link
          href="/gift-vouchers/purchase/"
          className="btn btn-primary inline-flex items-center gap-2 self-start lg:self-auto"
        >
          <Gift className="w-4 h-4" />
          Cadeaubon kopen
        </Link>
      </div>

      {/* Balance summary card */}
      <GiftCardBalance balance={balance} />

      {/* Redeem code input */}
      <RedeemCodeInput
        code={redeemCode}
        onChange={onRedeemCodeChange}
        onRedeem={onRedeem}
      />

      {/* Gift cards list + transaction history */}
      {giftCards.length === 0 ? (
        <AccountEmptyState
          icon={Gift}
          title="Geen cadeaubonnen"
          description="Je hebt nog geen cadeaubonnen gekocht of ontvangen."
          actionLabel="Cadeaubon kopen"
          actionHref="/gift-vouchers/purchase/"
        />
      ) : (
        <GiftCardList
          giftCards={giftCards}
          transactions={transactions}
          onSend={onSend}
          onPrint={onPrint}
        />
      )}

      {/* Buy-more banner */}
      <div className="flex items-center gap-4 bg-[var(--color-primary-glow)] border border-[var(--color-primary-light)] rounded-2xl p-4 lg:p-5">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-xl">
          🎁
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900">Verras iemand met een cadeaubon</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Kies een thema, bedrag en verzend direct per e-mail of per post.
          </div>
        </div>
        <Link
          href="/gift-vouchers/purchase/"
          className="btn btn-primary btn-sm flex-shrink-0 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Kopen
        </Link>
      </div>

      {/* Info box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Over cadeaubonnen</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>Cadeaubonnen zijn 1 jaar geldig vanaf aankoopdatum</li>
          <li>Je kunt cadeaubonnen gebruiken voor alle producten in de webshop</li>
          <li>Het restbedrag blijft beschikbaar voor toekomstige aankopen</li>
          <li>Cadeaubonnen zijn niet inwisselbaar voor contant geld</li>
        </ul>
      </div>
    </div>
  )
}
