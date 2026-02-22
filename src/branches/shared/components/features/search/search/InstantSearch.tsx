'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Search, X, Package, BookOpen, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchHit {
  id: string
  title: string
  slug: string
  brand?: string
  sku?: string
  price?: number
  stock?: number
  image?: string
  excerpt?: string
  categories?: string[]
  _formatted?: any
}

interface SearchResults {
  products?: {
    hits: SearchHit[]
    total: number
  }
  blogPosts?: {
    hits: SearchHit[]
    total: number
  }
  query?: string
  processingTimeMs?: number
}

interface InstantSearchProps {
  isOpen: boolean
  onClose: () => void
}

export const InstantSearch: React.FC<InstantSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults(null)
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null)
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeout)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Get all navigable items
      const productCount = results?.products?.hits.length || 0
      const blogCount = results?.blogPosts?.hits.length || 0
      const totalItems = productCount + blogCount

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break

        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1))
          break

        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break

        case 'Enter':
          e.preventDefault()
          if (totalItems > 0) {
            // Navigate to selected item
            const allHits = [
              ...(results?.products?.hits || []).map((hit) => ({ ...hit, type: 'product' as const })),
              ...(results?.blogPosts?.hits || []).map((hit) => ({ ...hit, type: 'blog' as const })),
            ]

            const selected = allHits[selectedIndex]
            if (selected) {
              const url = selected.type === 'product'
                ? `/${selected.slug}`
                : `/blog/${selected.slug}` // Simplified - should use category

              router.push(url)
              onClose()
            }
          } else if (query.length >= 2) {
            // Navigate to search results page
            router.push(`/search?q=${encodeURIComponent(query)}`)
            onClose()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query, onClose, router])

  if (!isOpen) return null

  const productHits = results?.products?.hits || []
  const blogHits = results?.blogPosts?.hits || []
  const hasResults = productHits.length > 0 || blogHits.length > 0

  return (
    <div className="fixed inset-0 z-[9999] animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="relative max-w-3xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek producten, artikelen..."
              className="flex-1 text-lg outline-none placeholder:text-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[500px] overflow-y-auto p-4">
            {loading && (
              <div className="text-center py-12 text-gray-500">
                <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-2" />
                <p>Zoeken...</p>
              </div>
            )}

            {!loading && query.length < 2 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Type minimaal 2 karakters om te zoeken</p>
              </div>
            )}

            {!loading && query.length >= 2 && !hasResults && (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-semibold mb-1">Geen resultaten gevonden</p>
                <p className="text-sm">Probeer een andere zoekterm</p>
              </div>
            )}

            {!loading && hasResults && (
              <div className="space-y-6">
                {/* Product Results */}
                {productHits.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                      <Package className="w-4 h-4" />
                      Producten ({results?.products?.total || 0})
                    </div>
                    <div className="space-y-1">
                      {productHits.map((hit, index) => (
                        <Link
                          key={hit.id}
                          href={`/${hit.slug}`}
                          onClick={onClose}
                          className={`flex items-center gap-4 p-3 rounded-xl hover:bg-teal-50 transition-colors ${
                            index === selectedIndex ? 'bg-teal-50' : ''
                          }`}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            🧤
                          </div>
                          <div className="flex-1 min-w-0">
                            {hit.brand && (
                              <div className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                                {hit._formatted?.brand || hit.brand}
                              </div>
                            )}
                            <div
                              className="font-semibold text-gray-900"
                              dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
                            />
                            {hit.sku && (
                              <div className="text-xs text-gray-500 font-mono mt-0.5">
                                SKU: {hit._formatted?.sku || hit.sku}
                              </div>
                            )}
                          </div>
                          {hit.price !== undefined && (
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-gray-900">
                                €{hit.price.toFixed(2)}
                              </div>
                              {hit.stock !== undefined && hit.stock > 0 && (
                                <div className="text-xs text-green-600 flex items-center gap-1 justify-end">
                                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                  Op voorraad
                                </div>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Results */}
                {blogHits.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                      <BookOpen className="w-4 h-4" />
                      Artikelen ({results?.blogPosts?.total || 0})
                    </div>
                    <div className="space-y-1">
                      {blogHits.map((hit, index) => (
                        <Link
                          key={hit.id}
                          href={`/blog/${hit.slug}`}
                          onClick={onClose}
                          className={`block p-3 rounded-xl hover:bg-amber-50 transition-colors ${
                            index + productHits.length === selectedIndex ? 'bg-amber-50' : ''
                          }`}
                        >
                          <div
                            className="font-semibold text-gray-900 mb-1"
                            dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
                          />
                          {hit.excerpt && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {hit.excerpt}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasResults && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-500">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">↑↓</kbd>
                <span>navigeren</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">↵</kbd>
                <span>selecteren</span>
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1"
              >
                Alle resultaten
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}
