import React from 'react'
import { Users, Copy, Check } from 'lucide-react'
import type { ReferralSectionProps } from './types'

export function ReferralSection({
  referralCode,
  referralUrl,
  referralCount = 0,
  referralPointsEarned = 0,
  referralActiveUsers = 0,
  onCopyCode,
  copied,
}: ReferralSectionProps) {
  const displayUrl = referralUrl || referralCode

  return (
    <div
      className="rounded-xl p-5 lg:p-6"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-glow), var(--color-primary-glow))',
        border: '1.5px solid var(--color-primary-glow)',
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="text-base font-extrabold text-gray-900">
            Verwijs een vriend, verdien 250 punten
          </div>
          <div className="text-sm text-gray-600 mt-0.5">
            Jij krijgt 250 punten en je vriend krijgt €5 korting op de eerste bestelling.
          </div>
        </div>
      </div>

      {/* Referral link row */}
      <div className="flex gap-2 mb-4">
        <div
          className="flex-1 h-10 px-3 border border-gray-200 rounded-lg bg-white font-mono text-sm text-gray-900 flex items-center overflow-hidden"
        >
          <span className="truncate">{displayUrl}</span>
        </div>
        <button
          onClick={onCopyCode}
          className="h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors"
          style={{
            background: copied ? 'var(--color-success)' : 'var(--color-primary)',
            color: 'white',
          }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Gekopieerd!' : 'Kopiëren'}
        </button>
      </div>

      {/* Referral stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2.5 bg-white rounded-xl">
          <div
            className="text-lg font-extrabold"
            style={{ color: 'var(--color-primary)' }}
          >
            {referralCount}
          </div>
          <div className="text-xs text-gray-500">Doorverwezen</div>
        </div>
        <div className="text-center p-2.5 bg-white rounded-xl">
          <div className="text-lg font-extrabold" style={{ color: 'var(--color-success)' }}>
            {referralPointsEarned.toLocaleString('nl-NL')}
          </div>
          <div className="text-xs text-gray-500">Punten verdiend</div>
        </div>
        <div className="text-center p-2.5 bg-white rounded-xl">
          <div className="text-lg font-extrabold" style={{ color: '#2196F3' }}>
            {referralActiveUsers}
          </div>
          <div className="text-xs text-gray-500">Actieve gebruikers</div>
        </div>
      </div>
    </div>
  )
}
