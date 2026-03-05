'use client'

import React from 'react'
import { FileText, ShoppingCart, MessageSquare } from 'lucide-react'
import type { OrderListSummaryProps } from './types'

const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealLight: '#26A69A',
  tealGlow: 'rgba(0,137,123,0.15)',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  green: '#00C853',
}

export function OrderListSummary({
  itemCount,
  totalValue,
  discount,
  expectedTotal,
  notes,
  onAddAllToCart,
  onRequestQuote,
  onNotesChange,
}: OrderListSummaryProps) {
  return (
    <>
      {/* TOTALS SUMMARY */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between gap-5 mb-5 flex-wrap"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex gap-8 flex-wrap">
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Artikelen
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {itemCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Totale waarde
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              &euro;{totalValue.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Staffelkorting
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.green,
              }}
            >
              &minus; &euro;{discount.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Verwachte totaal
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              &euro;{expectedTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={onRequestQuote}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:border-teal-700 hover:bg-teal-50"
            style={{
              background: 'white',
              color: COLORS.navy,
              border: `1.5px solid ${COLORS.grey}`,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            <FileText className="w-4 h-4" />
            Offerte aanvragen
          </button>
          <button
            onClick={onAddAllToCart}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Alles in winkelwagen
          </button>
        </div>
      </div>

      {/* NOTES */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div
          className="flex items-center gap-2 mb-2.5"
          style={{ fontSize: '14px', fontWeight: 700, color: COLORS.navy }}
        >
          <MessageSquare className="w-4 h-4" style={{ color: COLORS.teal }} />
          Notities bij deze lijst
        </div>
        <textarea
          value={notes ?? ''}
          onChange={(e) => onNotesChange?.(e.target.value)}
          placeholder="Bijv. instructies voor collega's, bestelmomenten, leveringsvoorkeuren…"
          className="w-full px-3.5 py-3 rounded-xl resize-vertical transition-all focus:outline-none"
          style={{
            border: `1.5px solid ${COLORS.grey}`,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            color: COLORS.navy,
            minHeight: '60px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.teal
            e.target.style.boxShadow = `0 0 0 3px ${COLORS.tealGlow}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.grey
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
    </>
  )
}
