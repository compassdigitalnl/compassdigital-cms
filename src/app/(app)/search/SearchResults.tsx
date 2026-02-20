'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Package, ArrowRight, TrendingUp } from 'lucide-react'

interface SearchHit {
  id: string
  title: string
  slug: string
  brand?: string
  sku?: string
  price?: number
  stock?: number
  image?: string
  description?: string
  _formatted?: any
}

interface SearchData {
  products?: {
    hits: SearchHit[]
    total: number
  }
  blogPosts?: {
    hits: any[]
    total: number
  }
  query?: string
  processingTimeMs?: number
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [data, setData] = useState<SearchData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null)
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all&limit=50`)
        const results = await response.json()
        setData(results)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const productHits = data?.products?.hits || []
  const productTotal = data?.products?.total || 0

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Zoekresultaten voor{' '}
          <mark className="bg-teal-100 text-teal-900 px-2 rounded">{query}</mark>
        </h1>
        {!loading && productTotal > 0 && (
          <p className="text-gray-600">
            <strong>{productTotal.toLocaleString('nl-NL')}</strong> producten gevonden
            {data?.processingTimeMs && (
              <span className="text-gray-400 ml-2">
                ({data.processingTimeMs}ms)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Zoeken...</p>
        </div>
      )}

      {/* No Query */}
      {!loading && !query && (
        <div className="text-center py-20">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start met zoeken</h2>
          <p className="text-gray-600">Voer een zoekterm in om producten te vinden</p>
        </div>
      )}

      {/* No Results */}
      {!loading && query && productHits.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Geen resultaten gevonden</h2>
          <p className="text-gray-600 mb-6">
            Probeer een andere zoekterm of verwijder enkele filters
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Bekijk alle producten
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {!loading && productHits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productHits.map((hit) => (
            <Link
              key={hit.id}
              href={`/products/${hit.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-teal-500 hover:shadow-lg transition-all"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-6xl mb-4 group-hover:bg-teal-50 transition-colors">
                🧤
              </div>

              {/* Brand */}
              {hit.brand && (
                <div className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">
                  {hit.brand}
                </div>
              )}

              {/* Title */}
              <h3
                className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors"
                dangerouslySetInnerHTML={{ __html: hit._formatted?.title || hit.title }}
              />

              {/* SKU */}
              {hit.sku && (
                <p className="text-xs text-gray-500 font-mono mb-3">
                  SKU: {hit.sku}
                </p>
              )}

              {/* Description */}
              {hit.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {hit.description}
                </p>
              )}

              {/* Price & Stock */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                {hit.price !== undefined && (
                  <div className="font-extrabold text-lg text-gray-900">
                    €{hit.price.toFixed(2)}
                  </div>
                )}
                {hit.stock !== undefined && hit.stock > 0 && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    Op voorraad
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
