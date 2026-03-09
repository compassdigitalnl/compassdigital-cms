'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, Package, BookOpen, FileText, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DidYouMean } from './DidYouMean'

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

interface HitSection {
  hits: SearchHit[]
  total: number
}

interface SearchResults {
  products?: HitSection
  blogPosts?: HitSection
  pages?: HitSection
  query?: string
  processingTimeMs?: number
}

interface SectionConfig {
  collection: string
  enabled: boolean
  label: string
  icon: string
  maxResults: number
}

interface SearchConfig {
  layout: 'stacked' | 'tabs'
  sections: SectionConfig[]
}

interface InstantSearchProps {
  isOpen: boolean
  onClose: () => void
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  'package': Package,
  'book-open': BookOpen,
  'file-text': FileText,
}

const DEFAULT_CONFIG: SearchConfig = {
  layout: 'stacked',
  sections: [
    { collection: 'products', enabled: true, label: 'Producten', icon: 'package', maxResults: 5 },
    { collection: 'blog-posts', enabled: true, label: 'Artikelen', icon: 'book-open', maxResults: 3 },
    { collection: 'pages', enabled: true, label: "Pagina's", icon: 'file-text', maxResults: 3 },
  ],
}

// Map collection to results key
type HitSectionKey = 'products' | 'blogPosts' | 'pages'
const COLLECTION_TO_KEY: Record<string, HitSectionKey> = {
  'products': 'products',
  'blog-posts': 'blogPosts',
  'pages': 'pages',
}

function getHitSection(results: SearchResults | null, collection: string): HitSection | undefined {
  if (!results) return undefined
  const key = COLLECTION_TO_KEY[collection]
  if (!key) return undefined
  return results[key]
}

// Color schemes per collection for hover/selected states and badges
const SECTION_COLORS: Record<string, { bg: string; badge: string; badgeText: string }> = {
  'products': { bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-700', badgeText: 'Product' },
  'blog-posts': { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', badgeText: 'Artikel' },
  'pages': { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', badgeText: 'Pagina' },
}

export const InstantSearch: React.FC<InstantSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchConfig, setSearchConfig] = useState<SearchConfig>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Log search click (fire-and-forget)
  const logClick = useCallback((hitId: string | number, collection: string, position: number) => {
    if (!query) return
    fetch('/api/search/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, clickedId: hitId, clickedCollection: collection, clickedPosition: position }),
    }).catch(() => {})
  }, [query])

  // Fetch config on mount
  useEffect(() => {
    fetch('/api/search/config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.layout && data?.sections) {
          setSearchConfig(data)
        }
      })
      .catch(() => {
        // Keep defaults
      })
  }, [])

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
      setActiveTab(0)
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
      setSuggestions([])
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`)
        const data = await response.json()
        setResults(data)

        // Generate "Bedoelde je?" suggestions on zero results
        const totalHits = (data.products?.total || 0) + (data.blogPosts?.total || 0) + (data.pages?.total || 0)
        if (totalHits === 0 && query.length >= 3) {
          // Simple typo suggestions: try common letter swaps and removals
          const q = query.toLowerCase()
          const possibleSuggestions: string[] = []
          // Remove double letters
          const deduped = q.replace(/(.)\1+/g, '$1')
          if (deduped !== q) possibleSuggestions.push(deduped)
          // Remove last character
          if (q.length > 3) possibleSuggestions.push(q.slice(0, -1))
          // Remove first character
          if (q.length > 3) possibleSuggestions.push(q.slice(1))
          setSuggestions(possibleSuggestions.filter((s, i, arr) => s !== q && arr.indexOf(s) === i).slice(0, 3))
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  // Get enabled sections with their hits
  const enabledSections = searchConfig.sections.filter((s) => s.enabled)

  // Build flat list of all hits for keyboard navigation
  const getAllHits = () => {
    if (!results) return []
    const allHits: { hit: SearchHit; collection: string; sectionIndex: number }[] = []

    if (searchConfig.layout === 'tabs') {
      // In tabs mode, only navigate within the active tab
      const section = enabledSections[activeTab]
      if (section) {
        const hits = getHitSection(results, section.collection)?.hits || []
        hits.forEach((hit: SearchHit) => allHits.push({ hit, collection: section.collection, sectionIndex: activeTab }))
      }
    } else {
      // In stacked mode, navigate through all sections
      enabledSections.forEach((section, sIdx) => {
        const hits = getHitSection(results, section.collection)?.hits || []
        hits.forEach((hit: SearchHit) => allHits.push({ hit, collection: section.collection, sectionIndex: sIdx }))
      })
    }

    return allHits
  }

  const getHitUrl = (hit: SearchHit, collection: string) => {
    switch (collection) {
      case 'products':
        return `/${hit.slug}`
      case 'blog-posts':
        return `/blog/${hit.slug}`
      case 'pages':
        return `/${hit.slug}`
      default:
        return `/${hit.slug}`
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      const allHits = getAllHits()
      const totalItems = allHits.length

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

        case 'Tab':
          if (searchConfig.layout === 'tabs' && enabledSections.length > 1) {
            e.preventDefault()
            setActiveTab((prev) => (e.shiftKey ? (prev - 1 + enabledSections.length) % enabledSections.length : (prev + 1) % enabledSections.length))
            setSelectedIndex(0)
          }
          break

        case 'Enter':
          e.preventDefault()
          if (totalItems > 0 && allHits[selectedIndex]) {
            const { hit, collection } = allHits[selectedIndex]
            router.push(getHitUrl(hit, collection))
            onClose()
          } else if (query.length >= 2) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
            onClose()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query, onClose, router, searchConfig, activeTab, enabledSections])

  if (!isOpen) return null

  // Check if we have any results at all
  const hasResults = enabledSections.some((section) => {
    const s = getHitSection(results, section.collection)
    return s && s.hits.length > 0
  })

  // Running offset for stacked keyboard navigation
  let globalIndex = 0

  const renderProductHit = (hit: SearchHit, isSelected: boolean) => (
    <>
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {hit.image ? (
          <img src={hit.image} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Package className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {hit.brand && (
          <div className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">
            {hit._formatted?.brand || hit.brand}
          </div>
        )}
        <div
          className="text-sm font-semibold text-gray-900 truncate"
          dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
        />
        {hit.sku && (
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            SKU: {hit._formatted?.sku || hit.sku}
          </div>
        )}
      </div>
      {hit.price != null && (
        <div className="text-right flex-shrink-0">
          <div className="text-[15px] font-extrabold text-gray-900">
            &euro;{hit.price.toFixed(2)}
          </div>
          {hit.stock !== undefined && hit.stock > 0 && (
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Op voorraad
            </div>
          )}
        </div>
      )}
    </>
  )

  const renderBlogHit = (hit: SearchHit) => (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium text-gray-900 truncate"
            dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
          />
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 flex-shrink-0">
            Artikel
          </span>
        </div>
        {hit.excerpt && (
          <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">
            {hit.excerpt}
          </p>
        )}
      </div>
    </>
  )

  const renderPageHit = (hit: SearchHit) => (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium text-gray-900 truncate"
            dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
          />
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 flex-shrink-0">
            Pagina
          </span>
        </div>
        {hit.excerpt && (
          <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">
            {hit.excerpt}
          </p>
        )}
      </div>
    </>
  )

  const renderHit = (hit: SearchHit, collection: string, isSelected: boolean, position: number) => {
    const colors = SECTION_COLORS[collection] || SECTION_COLORS['products']
    const url = getHitUrl(hit, collection)

    return (
      <Link
        key={`${collection}-${hit.id}`}
        href={url}
        onClick={() => {
          logClick(hit.id, collection, position)
          onClose()
        }}
        className={`flex items-center gap-4 p-3 rounded-xl hover:${colors.bg} transition-colors ${
          isSelected ? colors.bg : ''
        }`}
      >
        {collection === 'products' && renderProductHit(hit, isSelected)}
        {collection === 'blog-posts' && renderBlogHit(hit)}
        {collection === 'pages' && renderPageHit(hit)}
      </Link>
    )
  }

  const renderSection = (section: SectionConfig, sectionIndex: number) => {
    const sectionData = getHitSection(results, section.collection)
    const hits = sectionData?.hits || []
    if (hits.length === 0) return null

    const IconComponent = ICON_MAP[section.icon] || Package
    const startIndex = globalIndex

    const sectionContent = (
      <div key={section.collection}>
        {/* Section header — only show in stacked mode */}
        {searchConfig.layout === 'stacked' && (
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            <IconComponent className="w-3.5 h-3.5" />
            {section.label} ({sectionData?.total || 0})
          </div>
        )}
        <div className="space-y-0.5">
          {hits.map((hit: SearchHit, hitIdx: number) => {
            const currentGlobalIndex = startIndex + hitIdx
            const isSelected = currentGlobalIndex === selectedIndex
            return renderHit(hit, section.collection, isSelected, currentGlobalIndex)
          })}
        </div>
      </div>
    )

    globalIndex += hits.length
    return sectionContent
  }

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
              placeholder="Zoek producten, artikelen, pagina's..."
              className="flex-1 text-lg outline-none placeholder:text-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono bg-gray-100 border border-gray-300 rounded">
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
                {suggestions.length > 0 && (
                  <div className="mt-4">
                    <DidYouMean
                      query={query}
                      suggestions={suggestions}
                      onSuggestionClick={(s) => setQuery(s)}
                    />
                  </div>
                )}
              </div>
            )}

            {!loading && hasResults && (
              <>
                {/* Tabs header */}
                {searchConfig.layout === 'tabs' && enabledSections.length > 1 && (
                  <div className="flex gap-1 mb-4 border-b border-gray-200 -mt-1">
                    {enabledSections.map((section, idx) => {
                      const total = getHitSection(results, section.collection)?.total || 0
                      const IconComponent = ICON_MAP[section.icon] || Package
                      const isActive = idx === activeTab

                      return (
                        <button
                          key={section.collection}
                          onClick={() => { setActiveTab(idx); setSelectedIndex(0) }}
                          className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border-b-2 transition-colors ${
                            isActive
                              ? 'border-teal-600 text-teal-700'
                              : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          {section.label}
                          {total > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {total}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Sections content */}
                {searchConfig.layout === 'tabs' ? (
                  // Tabs: render only active tab section
                  <div>
                    {(() => {
                      globalIndex = 0
                      return renderSection(enabledSections[activeTab], activeTab)
                    })()}
                  </div>
                ) : (
                  // Stacked: render all sections
                  <div className="space-y-5">
                    {(() => {
                      globalIndex = 0
                      return enabledSections.map((section, idx) => renderSection(section, idx))
                    })()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {hasResults && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-500">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-[10px] font-mono">&uarr;&darr;</kbd>
                <span className="text-[11px]">navigeren</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-[10px] font-mono">&crarr;</kbd>
                <span className="text-[11px]">selecteren</span>
                {searchConfig.layout === 'tabs' && (
                  <>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-[10px] font-mono">Tab</kbd>
                    <span className="text-[11px]">sectie</span>
                  </>
                )}
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 text-[13px]"
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
