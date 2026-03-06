import React from 'react'
import { List, ShoppingBag, Gift, Star, Users, TrendingUp } from 'lucide-react'
import type { LoyaltyActivityProps } from './types'
import type { TransactionType } from '@/branches/ecommerce/templates/account/AccountTemplate1/LoyaltyTemplate/types'

function getTransactionIcon(type: TransactionType, isPositive: boolean) {
  const cls = `w-3.5 h-3.5`
  if (type === 'earned_purchase') return <ShoppingBag className={cls} />
  if (type === 'earned_review') return <Star className={cls} />
  if (type === 'earned_referral') return <Users className={cls} />
  if (type === 'earned_bonus') return <TrendingUp className={cls} />
  if (type === 'spent_reward') return <Gift className={cls} />
  return isPositive ? <TrendingUp className={cls} /> : <Gift className={cls} />
}

function getTransactionStyle(type: TransactionType, isPositive: boolean) {
  if (type === 'earned_purchase') return { bg: 'rgba(0,200,83,0.1)', color: 'var(--color-success)' }
  if (type === 'earned_review') return { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED' }
  if (type === 'earned_referral') return { bg: 'rgba(33,150,243,0.1)', color: '#2196F3' }
  if (type === 'earned_bonus') return { bg: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }
  if (type === 'spent_reward') return { bg: 'rgba(255,107,107,0.1)', color: 'var(--color-error)' }
  return isPositive
    ? { bg: 'rgba(0,200,83,0.1)', color: 'var(--color-success)' }
    : { bg: 'rgba(255,107,107,0.1)', color: 'var(--color-error)' }
}

export function LoyaltyActivity({ transactions }: LoyaltyActivityProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-200 flex items-center gap-1.5">
          <List className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <span className="font-extrabold text-sm text-gray-900">Recente activiteit</span>
        </div>
        <div className="p-8 text-center text-sm text-gray-400">Nog geen activiteit</div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-1.5">
        <List className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        <span className="font-extrabold text-sm text-gray-900">Recente activiteit</span>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map((tx) => {
          const isPositive = tx.points > 0
          const style = getTransactionStyle(tx.type, isPositive)
          return (
            <div key={tx.id} className="grid items-center gap-2.5 px-5 py-2.5"
              style={{ gridTemplateColumns: '36px 1fr auto' }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: style.bg, color: style.color }}
              >
                {getTransactionIcon(tx.type, isPositive)}
              </div>

              {/* Description */}
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-snug">
                  {tx.description}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(tx.createdAt).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Points */}
              <div
                className="font-mono font-bold text-xs tabular-nums"
                style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-error)' }}
              >
                {isPositive ? '+' : ''}
                {tx.points}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
