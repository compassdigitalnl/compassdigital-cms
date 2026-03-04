'use client'

import React from 'react'
import { Ticket, CheckCircle } from 'lucide-react'
import type { RedeemCodeInputProps } from './types'

export function RedeemCodeInput({ code, onChange, onRedeem }: RedeemCodeInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onRedeem()
  }

  return (
    <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
      {/* Icon */}
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
        <Ticket className="w-5 h-5 text-teal-600" />
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-900 mb-1.5">Cadeaubon inwisselen</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={code}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Voer boncode in…"
            maxLength={24}
            className="flex-1 h-10 px-3 border-[1.5px] border-gray-200 rounded-lg font-mono text-sm text-gray-900 uppercase tracking-wide outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-300 transition-colors"
          />
          <button
            onClick={onRedeem}
            disabled={!code.trim()}
            className="flex-shrink-0 h-10 px-4 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Inwisselen
          </button>
        </div>
      </div>
    </div>
  )
}
