'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

/**
 * Shop search hit from Meilisearch
 */
export interface ShopSearchHit {
  id: number
  title: string
  slug: string
  brand: string | null
  brandId: number | null
  brandLevel: number
  sku: string
  ean: string
  price: number | null
  salePrice: number | null
  effectivePrice: number | null
  compareAtPrice: number | null
  stock: number
  stockStatus: string
  backordersAllowed: boolean
  trackStock: boolean
  image: string | null
  categories: string[]
  categoryIds: number[]
  productType: string
  badge: string | null
  taxClass?: string
  specs: Record<string, string[]>
  shortDescription: string
  _formatted?: any
}

/**
 * Facet data returned from the search API
 */
export interface ShopFacets {
  brands: Record<string, number>
  brandIds: Record<string, number>
  brandLevels: Record<string, number>
  manufacturers: Record<string, number>
  productLines: Record<string, number>
  categories: Record<string, number>
  categoryIds: Record<string, number>
  stockStatus: Record<string, number>
  badge: Record<string, number>
  productType: Record<string, number>
  specs: Record<string, Record<string, number>>
  priceRange: { min: number; max: number } | null
}

/**
 * Search state managed by this hook
 */
export interface ShopSearchState {
  q: string
  categoryIds: number[]
  brandIds: number[]
  brandNames: string[]
  manufacturers: string[]
  productLines: string[]
  minPrice: number | null
  maxPrice: number | null
  specs: Record<string, string[]>
  stockStatus: string[]
  sort: string
  page: number
}

interface UseShopSearchResult {
  hits: ShopSearchHit[]
  total: number
  totalPages: number
  page: number
  facets: ShopFacets | null
  loading: boolean
  error: string | null
  processingTimeMs: number | null

  // Actions
  setQuery: (q: string) => void
  setCategoryIds: (ids: number[]) => void
  setBrandIds: (ids: number[]) => void
  setBrandNames: (names: string[]) => void
  setManufacturers: (names: string[]) => void
  setProductLines: (names: string[]) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setSpecFilter: (specKey: string, values: string[]) => void
  setStockStatus: (statuses: string[]) => void
  setSort: (sort: string) => void
  setPage: (page: number) => void
  resetFilters: () => void
  searchState: ShopSearchState
}

const INITIAL_STATE: ShopSearchState = {
  q: '',
  categoryIds: [],
  brandIds: [],
  brandNames: [],
  manufacturers: [],
  productLines: [],
  minPrice: null,
  maxPrice: null,
  specs: {},
  stockStatus: [],
  sort: 'relevance',
  page: 1,
}

/**
 * Hook for server-side shop search via Meilisearch.
 * Manages search state, URL sync, and API calls.
 */
export function useShopSearch(options?: {
  limit?: number
  initialCategoryIds?: number[]
}): UseShopSearchResult {
  const limit = options?.limit || 24
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const abortRef = useRef<AbortController | null>(null)

  const [state, setState] = useState<ShopSearchState>(() => {
    // Parse initial state from URL
    const q = searchParams.get('q') || ''
    const categoryIds = options?.initialCategoryIds || searchParams.getAll('category').map(Number).filter(n => !isNaN(n))
    const brandIds = searchParams.getAll('brand').map(Number).filter(n => !isNaN(n))
    const brandNames = searchParams.getAll('brandName')
    const manufacturers = searchParams.getAll('manufacturer')
    const productLines = searchParams.getAll('productLine')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null
    const stockStatus = searchParams.getAll('stock')
    const sort = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')

    // Parse spec filters
    const specs: Record<string, string[]> = {}
    searchParams.forEach((value, key) => {
      const match = key.match(/^specs\[(.+)\]$/)
      if (match) {
        const specKey = match[1].toLowerCase()
        if (!specs[specKey]) specs[specKey] = []
        specs[specKey].push(value)
      }
    })

    return { q, categoryIds, brandIds, brandNames, manufacturers, productLines, minPrice, maxPrice, specs, stockStatus, sort, page }
  })

  const [hits, setHits] = useState<ShopSearchHit[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [facets, setFacets] = useState<ShopFacets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null)

  // Build URL params from state
  const buildUrlParams = useCallback((s: ShopSearchState): URLSearchParams => {
    const params = new URLSearchParams()
    if (s.q) params.set('q', s.q)
    s.categoryIds.forEach(id => params.append('category', String(id)))
    s.brandIds.forEach(id => params.append('brand', String(id)))
    s.brandNames.forEach(name => params.append('brandName', name))
    s.manufacturers.forEach(name => params.append('manufacturer', name))
    s.productLines.forEach(name => params.append('productLine', name))
    if (s.minPrice !== null) params.set('minPrice', String(s.minPrice))
    if (s.maxPrice !== null) params.set('maxPrice', String(s.maxPrice))
    s.stockStatus.forEach(st => params.append('stock', st))
    if (s.sort !== 'relevance') params.set('sort', s.sort)
    if (s.page > 1) params.set('page', String(s.page))
    Object.entries(s.specs).forEach(([key, values]) => {
      values.forEach(v => params.append(`specs[${key}]`, v))
    })
    params.set('limit', String(limit))
    return params
  }, [limit])

  // Fetch search results
  const fetchResults = useCallback(async (s: ShopSearchState) => {
    // Cancel previous request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const params = buildUrlParams(s)
      const response = await fetch(`/api/shop/search?${params.toString()}`, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()

      if (!controller.signal.aborted) {
        setHits(data.hits || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
        setFacets(data.facets || null)
        setProcessingTimeMs(data.processingTimeMs || null)
        setLoading(false)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message)
        setLoading(false)
      }
    }
  }, [buildUrlParams])

  // Sync URL and fetch on state change
  useEffect(() => {
    fetchResults(state)

    // Update URL (without scroll)
    const params = buildUrlParams(state)
    // Remove limit from URL display
    params.delete('limit')
    const qs = params.toString()
    const newUrl = qs ? `${pathname}?${qs}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [state, fetchResults, buildUrlParams, pathname, router])

  // Actions
  const updateState = useCallback((partial: Partial<ShopSearchState>) => {
    setState(prev => ({ ...prev, ...partial, page: partial.page ?? 1 }))
  }, [])

  const setQuery = useCallback((q: string) => updateState({ q }), [updateState])
  const setCategoryIds = useCallback((ids: number[]) => updateState({ categoryIds: ids }), [updateState])
  const setBrandIds = useCallback((ids: number[]) => updateState({ brandIds: ids }), [updateState])
  const setBrandNames = useCallback((names: string[]) => updateState({ brandNames: names }), [updateState])
  const setManufacturers = useCallback((names: string[]) => updateState({ manufacturers: names }), [updateState])
  const setProductLines = useCallback((names: string[]) => updateState({ productLines: names }), [updateState])
  const setPriceRange = useCallback((min: number | null, max: number | null) => updateState({ minPrice: min, maxPrice: max }), [updateState])
  const setStockStatus = useCallback((statuses: string[]) => updateState({ stockStatus: statuses }), [updateState])
  const setSort = useCallback((sort: string) => updateState({ sort }), [updateState])
  const setPage = useCallback((page: number) => setState(prev => ({ ...prev, page })), [])

  const setSpecFilter = useCallback((specKey: string, values: string[]) => {
    setState(prev => {
      const newSpecs = { ...prev.specs }
      if (values.length === 0) {
        delete newSpecs[specKey]
      } else {
        newSpecs[specKey] = values
      }
      return { ...prev, specs: newSpecs, page: 1 }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      categoryIds: options?.initialCategoryIds || [],
    }))
  }, [options?.initialCategoryIds])

  return {
    hits,
    total,
    totalPages,
    page: state.page,
    facets,
    loading,
    error,
    processingTimeMs,
    setQuery,
    setCategoryIds,
    setBrandIds,
    setBrandNames,
    setManufacturers,
    setProductLines,
    setPriceRange,
    setSpecFilter,
    setStockStatus,
    setSort,
    setPage,
    resetFilters,
    searchState: state,
  }
}
