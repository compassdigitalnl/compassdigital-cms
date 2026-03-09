'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, PlusCircle, Trash2, Minus, Plus } from 'lucide-react'
import type { QuoteProductTableProps, QuoteProduct } from './types'

interface SearchResult {
  id: string
  title: string
  sku: string
  brand?: string
}

export function QuoteProductTable({ products, onQuantityChange, onRemove, onAddProduct }: QuoteProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.docs || [])
        }
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = (result: SearchResult) => {
    if (onAddProduct) {
      onAddProduct({
        id: String(result.id),
        name: result.title,
        sku: result.sku || '',
        emoji: '📦',
        quantity: 1,
      })
    }
    setSearchQuery('')
    setShowResults(false)
    setSearchResults([])
  }

  return (
    <div>
      {/* Product search */}
      <div className="relative mb-4" ref={containerRef}>
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--color-muted)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true) }}
          placeholder="Zoek product op naam, merk of artikelnummer…"
          className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border-2 bg-gray-50 outline-none transition-all focus:bg-white"
          style={{
            borderColor: 'var(--color-border)',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)'
            e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-primary-glow)'
            setShowResults(true)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {showResults && searchQuery.length >= 2 && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl overflow-hidden"
            style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
          >
            {searchLoading && (
              <div className="px-4 py-3 text-sm text-gray-400">Zoeken...</div>
            )}
            {!searchLoading && searchResults.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">Geen resultaten gevonden</div>
            )}
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onMouseDown={() => handleSelectResult(result)}
                className="btn btn-ghost w-full flex items-center gap-3 text-left"
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: 'var(--color-surface)' }}
                >
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{result.title}</div>
                  <div className="text-xs text-gray-400 font-mono">{result.sku}</div>
                </div>
                <PlusCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product table */}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="text-left text-xs font-bold uppercase tracking-wider pb-2 px-2.5 border-b-2"
                  style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
                >
                  Product
                </th>
                <th
                  className="text-left text-xs font-bold uppercase tracking-wider pb-2 px-2.5 border-b-2"
                  style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
                >
                  Aantal
                </th>
                <th
                  className="pb-2 px-2.5 border-b-2 w-10"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id} className={idx < products.length - 1 ? 'border-b' : ''} style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-3 px-2.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: 'var(--color-surface)' }}
                      >
                        {product.emoji || '📦'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>
                          {product.name}
                        </div>
                        <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-muted)' }}>
                          Art. {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2.5 align-middle">
                    <div
                      className="inline-flex items-center rounded-lg overflow-hidden border-[1.5px]"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <button
                        type="button"
                        onClick={() => onQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                        className="btn btn-ghost btn-sm w-8 h-8 flex items-center justify-center"
                        style={{ color: 'var(--color-foreground)' }}
                        aria-label="Minder"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className="w-10 text-center text-sm font-semibold font-mono"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                        className="btn btn-ghost btn-sm w-8 h-8 flex items-center justify-center"
                        style={{ color: 'var(--color-foreground)' }}
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
                      className="btn btn-ghost btn-sm w-7 h-7 flex items-center justify-center group"
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
        className="btn btn-outline-primary mt-3 w-full flex items-center gap-2"
        style={{ borderStyle: 'dashed' }}
      >
        <PlusCircle className="w-4 h-4" />
        Product toevoegen
      </button>
    </div>
  )
}
