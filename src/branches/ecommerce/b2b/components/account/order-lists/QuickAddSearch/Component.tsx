'use client'

import React from 'react'
import { Search, ScanLine, Plus, PlusCircle } from 'lucide-react'
import type { QuickAddSearchProps } from './types'

const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealGlow: 'var(--color-primary-glow)',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  bg: '#F5F7FA',
}

export function QuickAddSearch({
  query,
  focused,
  results,
  loading,
  onQueryChange,
  onFocus,
  onBlur,
  onAddProduct,
  onScanBarcode,
}: QuickAddSearchProps) {
  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
    >
      <div
        className="flex items-center gap-2 mb-3"
        style={{ fontSize: '14px', fontWeight: 700, color: COLORS.navy }}
      >
        <PlusCircle className="w-4 h-4" style={{ color: COLORS.teal }} />
        Product toevoegen aan lijst
      </div>

      <div className="flex gap-2.5 flex-wrap">
        {/* Search Input with Dropdown */}
        <div className="flex-1 min-w-0 relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: COLORS.greyMid }}
          />
          <input
            type="text"
            placeholder="Zoek op productnaam, artikelnummer of EAN…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none"
            style={{
              background: COLORS.bg,
              border: `2px solid ${focused ? COLORS.teal : COLORS.grey}`,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: focused ? `0 0 0 4px ${COLORS.tealGlow}` : 'none',
            }}
          />

          {/* Dropdown */}
          {focused && query.length >= 2 && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
              style={{
                background: 'white',
                border: `1.5px solid ${COLORS.grey}`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {/* Dropdown header */}
              <div
                className="px-4 py-3"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: COLORS.greyMid,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: COLORS.bg,
                  borderBottom: `1px solid ${COLORS.grey}`,
                }}
              >
                {loading ? 'Zoeken...' : `${results.length} resultaten`}
              </div>

              {loading ? (
                <div className="px-4 py-6 text-center">
                  <div
                    className="w-8 h-8 rounded-full border-3 border-t-transparent animate-spin mx-auto"
                    style={{ borderColor: COLORS.teal, borderTopColor: 'transparent' }}
                  />
                </div>
              ) : results.length === 0 ? (
                <div
                  className="px-4 py-6 text-center"
                  style={{ fontSize: '14px', color: COLORS.greyMid }}
                >
                  Geen producten gevonden voor &quot;{query}&quot;
                </div>
              ) : (
                results.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => onAddProduct(product)}
                    className="flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-all hover:bg-[var(--color-primary-glow)]"
                    style={{
                      borderBottom: idx < results.length - 1 ? `1px solid ${COLORS.grey}` : 'none',
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: COLORS.bg }}
                    >
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold truncate"
                        style={{ fontSize: '14px', color: COLORS.navy }}
                      >
                        {product.title}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.greyMid }}>
                        {product.sku} &middot; {product.brand} &middot;{' '}
                        {product.stock > 0
                          ? `${product.stock} op voorraad`
                          : 'Uitverkocht'}
                      </div>
                    </div>
                    <div
                      className="flex-shrink-0"
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '15px',
                        fontWeight: 800,
                        color: COLORS.navy,
                      }}
                    >
                      &euro;{product.price.toFixed(2)}
                    </div>
                    <button
                      className="btn btn-primary btn-sm w-8 h-8 flex items-center justify-center flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddProduct(product)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <span
          className="flex items-center"
          style={{ fontSize: '13px', color: COLORS.greyMid, fontWeight: 500 }}
        >
          of
        </span>

        {/* Barcode scan button */}
        <button
          onClick={onScanBarcode}
          className="btn btn-outline-neutral flex items-center gap-1.5"
          style={{ whiteSpace: 'nowrap' }}
        >
          <ScanLine className="w-4 h-4" />
          Scan barcode
        </button>
      </div>
    </div>
  )
}
