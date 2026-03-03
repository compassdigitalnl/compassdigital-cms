import { NextRequest, NextResponse } from 'next/server'
import { meilisearchClient, INDEXES, isMeilisearchAvailable } from '@/lib/meilisearch/client'

/**
 * Shop Search API — Meilisearch-powered faceted product search
 *
 * GET /api/shop/search?q=&category=123&brand=456&minPrice=10&maxPrice=50&specs[maat]=L&page=1&limit=24&sort=price:asc
 *
 * Returns: { hits, total, page, totalPages, facets: { brands, categories, specs, priceRange, stockCounts } }
 */

interface ShopSearchParams {
  q: string
  categoryIds: number[]
  brandIds: number[]
  brandNames: string[]
  minPrice: number | null
  maxPrice: number | null
  specs: Record<string, string[]>
  stockStatus: string[]
  badge: string | null
  productType: string | null
  page: number
  limit: number
  sort: string | null
}

function parseSearchParams(searchParams: URLSearchParams): ShopSearchParams {
  const q = searchParams.get('q') || ''

  // Category IDs
  const categoryIds = searchParams.getAll('category').map(Number).filter(n => !isNaN(n))

  // Brand IDs (numeric) and Brand Names (string)
  const brandRaw = searchParams.getAll('brand')
  const brandIds = brandRaw.map(Number).filter(n => !isNaN(n))
  const brandNames = searchParams.getAll('brandName')

  // Price range
  const minPriceStr = searchParams.get('minPrice')
  const maxPriceStr = searchParams.get('maxPrice')
  const minPrice = minPriceStr ? parseFloat(minPriceStr) : null
  const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : null

  // Specifications (specs[maat]=L&specs[maat]=XL&specs[kleur]=rood)
  const specs: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    const match = key.match(/^specs\[(.+)\]$/)
    if (match) {
      const specKey = match[1].toLowerCase()
      if (!specs[specKey]) specs[specKey] = []
      specs[specKey].push(value)
    }
  })

  // Stock status filter
  const stockStatus = searchParams.getAll('stock')

  // Badge filter
  const badge = searchParams.get('badge')

  // Product type filter
  const productType = searchParams.get('productType')

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24')))

  // Sort: price:asc, price:desc, createdAt:desc, title:asc
  const sort = searchParams.get('sort')

  return { q, categoryIds, brandIds, brandNames, minPrice, maxPrice, specs, stockStatus, badge, productType, page, limit, sort }
}

function buildMeilisearchFilter(params: ShopSearchParams): string[] {
  const filters: string[] = []

  // Only published products
  filters.push('status = "published"')

  // Category filter
  if (params.categoryIds.length > 0) {
    const catFilters = params.categoryIds.map(id => `categoryIds = ${id}`)
    filters.push(`(${catFilters.join(' OR ')})`)
  }

  // Brand filter (by ID or by name)
  const brandClauses: string[] = []
  if (params.brandIds.length > 0) {
    brandClauses.push(...params.brandIds.map(id => `brandId = ${id}`))
  }
  if (params.brandNames.length > 0) {
    brandClauses.push(...params.brandNames.map(name => `brand = "${name.replace(/"/g, '\\"')}"`))
  }
  if (brandClauses.length > 0) {
    filters.push(`(${brandClauses.join(' OR ')})`)
  }

  // Price range
  if (params.minPrice !== null) {
    filters.push(`effectivePrice >= ${params.minPrice}`)
  }
  if (params.maxPrice !== null) {
    filters.push(`effectivePrice <= ${params.maxPrice}`)
  }

  // Stock status
  if (params.stockStatus.length > 0) {
    const stockFilters = params.stockStatus.map(s => `stockStatus = "${s}"`)
    filters.push(`(${stockFilters.join(' OR ')})`)
  }

  // Badge
  if (params.badge) {
    filters.push(`badge = "${params.badge}"`)
  }

  // Product type
  if (params.productType) {
    filters.push(`productType = "${params.productType}"`)
  }

  // Specification filters (flat fields: spec_kleur, spec_maat, etc.)
  for (const [key, values] of Object.entries(params.specs)) {
    if (values.length > 0) {
      const specFilters = values.map(v => `spec_${key} = "${v.replace(/"/g, '\\"')}"`)
      filters.push(`(${specFilters.join(' OR ')})`)
    }
  }

  return filters
}

function buildSort(sort: string | null): string[] | undefined {
  if (!sort) return undefined

  switch (sort) {
    case 'price:asc':
    case 'price-asc':
      return ['effectivePrice:asc']
    case 'price:desc':
    case 'price-desc':
      return ['effectivePrice:desc']
    case 'newest':
    case 'createdAt:desc':
      return ['createdAt:desc']
    case 'name-asc':
    case 'title:asc':
      return ['title:asc']
    case 'name-desc':
    case 'title:desc':
      return ['title:desc']
    default:
      return undefined
  }
}

export async function GET(request: NextRequest) {
  try {
    const available = await isMeilisearchAvailable()
    if (!available) {
      return NextResponse.json(
        { error: 'Search service unavailable' },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const params = parseSearchParams(searchParams)
    const filter = buildMeilisearchFilter(params)
    const sort = buildSort(params.sort)

    const index = meilisearchClient.index(INDEXES.PRODUCTS)

    const result = await index.search(params.q, {
      filter,
      sort,
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      facets: ['*'], // All filterable attributes (includes dynamic spec_ fields)
      attributesToHighlight: ['title', 'brand'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    // Process facet distribution into clean format
    const facets = {
      brands: result.facetDistribution?.brand || {},
      brandIds: result.facetDistribution?.brandId || {},
      brandLevels: result.facetDistribution?.brandLevel || {},
      categories: result.facetDistribution?.categories || {},
      categoryIds: result.facetDistribution?.categoryIds || {},
      stockStatus: result.facetDistribution?.stockStatus || {},
      badge: result.facetDistribution?.badge || {},
      productType: result.facetDistribution?.productType || {},
      // Collect spec facets (flat fields: spec_kleur → kleur)
      specs: Object.entries(result.facetDistribution || {})
        .filter(([key]) => key.startsWith('spec_'))
        .reduce((acc, [key, dist]) => {
          const specName = key.replace('spec_', '')
          acc[specName] = dist as Record<string, number>
          return acc
        }, {} as Record<string, Record<string, number>>),
      // Price range from facet stats
      priceRange: result.facetStats?.effectivePrice
        ? { min: result.facetStats.effectivePrice.min, max: result.facetStats.effectivePrice.max }
        : null,
    }

    const total = result.estimatedTotalHits || 0
    const totalPages = Math.ceil(total / params.limit)

    return NextResponse.json({
      hits: result.hits,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      facets,
      processingTimeMs: result.processingTimeMs,
    })
  } catch (error: any) {
    console.error('Shop search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 },
    )
  }
}
