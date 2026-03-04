'use client'

import React, { useState } from 'react'
import { Search, PlusCircle, Trash2, Minus, Plus } from 'lucide-react'
import type { QuoteProductTableProps } from './types'

export function QuoteProductTable({ products, onQuantityChange, onRemove }: QuoteProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      {/* Product search */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--color-muted, #94A3B8)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Zoek product op naam, merk of artikelnummer…"
          className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border-2 bg-gray-50 outline-none transition-all focus:bg-white"
          style={{
            borderColor: 'var(--color-border, #E8ECF1)',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary, #00897B)'
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0,137,123,0.10)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border, #E8ECF1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Product table */}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="text-left text-xs font-bold uppercase tracking-wider pb-2 px-2.5 border-b-2"
                  style={{ color: 'var(--color-muted, #94A3B8)', borderColor: 'var(--color-border, #E8ECF1)' }}
                >
                  Product
                </th>
                <th
                  className="text-left text-xs font-bold uppercase tracking-wider pb-2 px-2.5 border-b-2"
                  style={{ color: 'var(--color-muted, #94A3B8)', borderColor: 'var(--color-border, #E8ECF1)' }}
                >
                  Aantal
                </th>
                <th
                  className="pb-2 px-2.5 border-b-2 w-10"
                  style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
                />
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id} className={idx < products.length - 1 ? 'border-b' : ''} style={{ borderColor: 'var(--color-border, #E8ECF1)' }}>
                  <td className="py-3 px-2.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: 'var(--color-surface, #F1F4F8)' }}
                      >
                        {product.emoji || '📦'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--color-foreground, #0A1628)' }}>
                          {product.name}
                        </div>
                        <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-muted, #94A3B8)' }}>
                          Art. {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2.5 align-middle">
                    <div
                      className="inline-flex items-center rounded-lg overflow-hidden border-[1.5px]"
                      style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
                    >
                      <button
                        type="button"
                        onClick={() => onQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors text-sm"
                        style={{ color: 'var(--color-foreground, #0A1628)' }}
                        aria-label="Minder"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className="w-10 text-center text-sm font-semibold font-mono"
                        style={{ color: 'var(--color-foreground, #0A1628)' }}
                      >
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors text-sm"
                        style={{ color: 'var(--color-foreground, #0A1628)' }}
                        aria-label="Meer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2.5 align-middle">
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-red-50 group"
                      aria-label="Verwijder product"
                    >
                      <Trash2
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add product row */}
      <button
        type="button"
        className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed text-sm font-semibold transition-all"
        style={{ borderColor: 'var(--color-border, #E8ECF1)', color: 'var(--color-primary, #00897B)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary, #00897B)'
          e.currentTarget.style.background = 'rgba(0,137,123,0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border, #E8ECF1)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <PlusCircle className="w-4 h-4" />
        Product toevoegen
      </button>
    </div>
  )
}
