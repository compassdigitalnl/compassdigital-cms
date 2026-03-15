'use client'

import React from 'react'
import { Ticket, CheckCircle } from 'lucide-react'
import type { RedeemCodeInputProps } from './types'

export function RedeemCodeInput({ code, onChange, onRedeem }: RedeemCodeInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onRedeem()
  }

  return (
    <div className="bg-white border-[1.5px] border-grey-light rounded-2xl p-4 mb-4 flex items-center gap-3">
      {/* Icon */}
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--color-primary-glow)] flex items-center justify-center">
        <Ticket className="w-5 h-5 text-[var(--color-primary)]" />
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="text-sm font-bold text-navy mb-1.5">Cadeaubon inwisselen</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Voer boncode in…"
            maxLength={24}
            className="flex-1 h-10 px-3 border-[1.5px] border-grey-light rounded-lg font-mono text-sm text-navy uppercase tracking-wide outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-grey-mid transition-colors"
          />
          <button
            onClick={onRedeem}
            disabled={!code.trim()}
            className="btn btn-sm btn-primary flex-shrink-0 flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Inwisselen
          </button>
        </div>
      </div>
    </div>
  )
}
