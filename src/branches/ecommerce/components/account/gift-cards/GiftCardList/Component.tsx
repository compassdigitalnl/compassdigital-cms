'use client'

import React from 'react'
import {
  Wallet,
  List,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Check,
} from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { GiftCardListProps } from './types'
import type { GiftCard, GiftCardTransaction } from '@/branches/ecommerce/templates/account/AccountTemplate1/GiftCardsTemplate/types'

// ── helpers ────────────────────────────────────────────────────────────────

function statusLabel(status: GiftCard['status']): string {
  if (status === 'active') return 'Actief'
  if (status === 'spent') return 'Volledig besteed'
  return 'Verlopen'
}

function statusClasses(status: GiftCard['status']): string {
  if (status === 'active') return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-500'
}

function badgeBg(status: GiftCard['status']): string {
  if (status === 'active') return 'bg-green-500'
  return 'bg-gray-400'
}

function fillColor(status: GiftCard['status']): string {
  if (status === 'active') return 'bg-teal-600'
  return 'bg-gray-400'
}

function balanceColor(status: GiftCard['status']): string {
  if (status === 'active') return 'text-teal-600'
  return 'text-gray-700'
}

function txIconBg(tx: GiftCardTransaction): string {
  if (tx.type === 'credit') return 'bg-green-100'
  if (tx.description.toLowerCase().includes('bestel')) return 'bg-blue-100'
  return 'bg-purple-100'
}

function TxIcon({ tx }: { tx: GiftCardTransaction }) {
  if (tx.type === 'credit')
    return <ArrowDownLeft className="w-4 h-4 text-green-600" />
  if (tx.description.toLowerCase().includes('bestel'))
    return <ShoppingBag className="w-4 h-4 text-blue-600" />
  return <ArrowUpRight className="w-4 h-4 text-purple-600" />
}

// ── sub-components ─────────────────────────────────────────────────────────

function GiftCardCard({ card, onSend, onPrint }: { card: GiftCard; onSend: (id: number) => void; onPrint: (id: number) => void }) {
  const { formatPriceStr } = usePriceMode()
  const fillPct = card.amount > 0 ? Math.round((card.balance / card.amount) * 100) : 0
  const isActive = card.status === 'active'
  const opacity = isActive ? '' : 'opacity-60'

  return (
    <div className={`bg-white border border-gray-200 rounded-[14px] p-4 flex gap-3 hover:border-teal-500 transition-colors ${opacity}`}>
      {/* Visual icon */}
      <div className="relative flex-shrink-0">
        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-2xl">
          {card.occasionEmoji || '🎁'}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center ${badgeBg(card.status)}`}>
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-mono text-xs text-gray-400">{card.code}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${statusClasses(card.status)}`}>
            {statusLabel(card.status)}
          </span>
        </div>

        {card.from && (
          <div className="text-[13px] font-bold text-gray-900 mb-0.5">
            Van {card.from}
          </div>
        )}

        {card.occasion && (
          <div className="text-[11px] text-gray-400">
            {card.occasion} &middot; Ontvangen {new Date(card.purchasedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-1.5 h-[5px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${fillColor(card.status)}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className={`font-extrabold text-[13px] ${balanceColor(card.status)}`}>
            €{formatPriceStr(card.balance)} over
          </span>
          <span className="text-[11px] text-gray-400">
            van €{formatPriceStr(card.amount)}
          </span>
        </div>

        {/* Actions — only for active cards with delivery info */}
        {isActive && (card.deliveryMethod === 'email' || card.deliveryMethod === 'print') && (
          <div className="flex gap-1.5 mt-2">
            {card.deliveryMethod === 'email' && (
              <button
                onClick={() => onSend(card.id)}
                className="flex-1 px-2 py-1.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Opnieuw versturen
              </button>
            )}
            {card.deliveryMethod === 'print' && (
              <button
                onClick={() => onPrint(card.id)}
                className="flex-1 px-2 py-1.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Printen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionRow({ tx }: { tx: GiftCardTransaction }) {
  const { formatPriceStr } = usePriceMode()
  return (
    <div className="grid grid-cols-[40px_1fr_auto] gap-3 items-center px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${txIconBg(tx)}`}>
        <TxIcon tx={tx} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">{tx.description}</div>
        <div className="flex gap-2 text-[11px] text-gray-400 mt-0.5">
          <span>{new Date(tx.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {tx.code && <span>{tx.code}</span>}
        </div>
      </div>
      <div className={`font-mono font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
        {tx.type === 'credit' ? '+ ' : '− '}€{formatPriceStr(tx.amount)}
      </div>
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────

export function GiftCardList({ giftCards, transactions, onSend, onPrint }: GiftCardListProps) {
  return (
    <div className="space-y-4">
      {/* Gift cards grid */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-extrabold text-gray-900 mb-3">
          <Wallet className="w-[17px] h-[17px] text-teal-600" />
          Mijn cadeaubonnen
        </h2>

        {giftCards.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
            Geen cadeaubonnen gevonden
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {giftCards.map((card) => (
              <GiftCardCard key={card.id} card={card} onSend={onSend} onPrint={onPrint} />
            ))}
          </div>
        )}
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-gray-900">
              <List className="w-[15px] h-[15px] text-teal-600" />
              Transactiehistorie
            </h3>
          </div>
          <div>
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
