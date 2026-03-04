import React from 'react'
import Link from 'next/link'
import { RotateCcw, FileText, MessageCircle } from 'lucide-react'
import { features } from '@/lib/features'

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <h2 className="text-base lg:text-lg font-extrabold mb-3 lg:mb-4 text-gray-900">
        Snelle acties
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        {features.recurringOrders && (
          <Link
            href="/account/recurring-orders"
            className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
            style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', border: '1.5px solid var(--color-border)' }}
          >
            <div
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-gray-900 mb-0.5">Herhaalbestelling</div>
              <div className="text-xs text-gray-500">Bestel laatste order opnieuw</div>
            </div>
          </Link>
        )}

        <button
          className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
          style={{ background: 'rgba(0,200,83,0.08)', border: '1.5px solid var(--color-border)' }}
        >
          <div
            className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-success)' }}
          >
            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-gray-900 mb-0.5">Offerte aanvragen</div>
            <div className="text-xs text-gray-500">Voor grote hoeveelheden</div>
          </div>
        </button>

        <button
          className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.02]"
          style={{ background: 'rgba(33,150,243,0.08)', border: '1.5px solid var(--color-border)' }}
        >
          <div
            className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-info)' }}
          >
            <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-gray-900 mb-0.5">Klantenservice</div>
            <div className="text-xs text-gray-500">Chat of bel ons</div>
          </div>
        </button>
      </div>
    </div>
  )
}
