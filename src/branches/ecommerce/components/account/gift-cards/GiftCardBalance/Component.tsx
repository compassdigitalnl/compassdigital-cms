'use client'

import React from 'react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { GiftCardBalanceProps } from './types'

export function GiftCardBalance({ balance }: GiftCardBalanceProps) {
  const { formatPriceStr } = usePriceMode()
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 lg:p-7 mb-4">
      {/* Decorative emoji watermark */}
      <span
        className="pointer-events-none select-none absolute right-6 -top-2 text-[80px] opacity-[0.06]"
        aria-hidden
      >
        🎁
      </span>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Total balance */}
        <div className="relative">
          <div className="text-xs font-bold tracking-widest text-white/40 uppercase mb-1">
            Totaal beschikbaar saldo
          </div>
          <div className="text-4xl lg:text-5xl font-extrabold text-white leading-none">
            €{formatPriceStr(balance.totalBalance)}
          </div>
          <div className="text-sm text-white/35 mt-1">
            Over {balance.activeCount} actieve {balance.activeCount === 1 ? 'cadeaubon' : 'cadeaubonnen'}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 lg:ml-auto">
          <div className="text-center px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl min-w-[100px]">
            <div className="text-lg font-extrabold text-white">{balance.received}</div>
            <div className="text-[11px] text-white/35">Ontvangen</div>
          </div>
          <div className="text-center px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl min-w-[100px]">
            <div className="text-lg font-extrabold text-white">{balance.sent}</div>
            <div className="text-[11px] text-white/35">Verzonden</div>
          </div>
          <div className="text-center px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl min-w-[100px]">
            <div className="text-lg font-extrabold text-white">
              €{formatPriceStr(balance.totalSpent)}
            </div>
            <div className="text-[11px] text-white/35">Totaal besteed</div>
          </div>
          <div className="text-center px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl min-w-[100px]">
            <div className="text-lg font-extrabold text-white">
              €{formatPriceStr(balance.totalReceived)}
            </div>
            <div className="text-[11px] text-white/35">Totaal ontvangen</div>
          </div>
        </div>
      </div>
    </div>
  )
}
