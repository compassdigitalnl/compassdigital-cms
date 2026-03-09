import { NextRequest, NextResponse } from 'next/server'
import { meilisearchClient, INDEXES, isMeilisearchAvailable } from '@/features/search/lib/meilisearch/client'
import { analyzeQuery } from '@/features/search/lib/query/query-analyzer'
import { logSearch } from '@/features/search/lib/analytics/search-logger'

/**
 * GET /api/search?q=query&type=products&mode=hybrid
 *
 * Instant search API with optional hybrid (keyword + semantic) mode
 *
 * Query params:
 * - q: search query (required)
 * - type: 'products' | 'blog-posts' | 'pages' | 'all' (default: 'all')
 * - limit: number of results (default: 10)
 * - mode: 'keyword' | 'hybrid' (default: 'keyword', falls back gracefully)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const mode = searchParams.get('mode') || 'keyword'

    // Validate query
    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        message: 'Query too short. Minimum 2 characters required.',
      })
    }

    // Check if Meilisearch is available
    const available = await isMeilisearchAvailable()

    if (!available) {
      return NextResponse.json(
        {
          error: 'Search service unavailable',
          message: 'Meilisearch server is not running',
        },
        { status: 503 }
      )
    }

    // Analyze query for NLP insights
    const queryAnalysis = analyzeQuery(query)

    // Empty result helper
    const emptyResult = { hits: [] as any[], estimatedTotalHits: 0, processingTimeMs: 0 }

    // Try hybrid search if requested and OpenAI key is available
    if (mode === 'hybrid' && process.env.OPENAI_API_KEY) {
      try {
        const { hybridSearch } = await import('@/features/search/lib/hybrid/hybrid-search')
        const hybridResult = await hybridSearch({
          query,
          limit,
          collections: type === 'all' ? ['products', 'blog-posts', 'pages'] : [type as any],
        })

        const responseTimeMs = Date.now() - startTime

        // Log search (fire-and-forget)
        logSearch({
          query,
          queryType: hybridResult.mode,
          resultsCount: hybridResult.results.length,
          responseTimeMs,
        }).catch(() => {})

        // Group results by collection for consistent API response
        const products = hybridResult.results.filter(r => r.collection === 'products')
        const blogPosts = hybridResult.results.filter(r => r.collection === 'blog-posts')
        const pages = hybridResult.results.filter(r => r.collection === 'pages')

        return NextResponse.json({
          products: { hits: products, total: products.length },
          blogPosts: { hits: blogPosts, total: blogPosts.length },
          pages: { hits: pages, total: pages.length },
          query,
          queryAnalysis: {
            isNaturalLanguage: queryAnalysis.isNaturalLanguage,
            intent: queryAnalysis.intent,
            extractedFilters: queryAnalysis.extractedFilters,
          },
          mode: hybridResult.mode,
          processingTimeMs: responseTimeMs,
        })
      } catch (hybridError) {
        // Fall through to keyword search
        console.warn('[Search] Hybrid search failed, falling back to keyword:', (hybridError as any).message)
      }
    }

    // Standard keyword search
    if (type === 'all') {
      const [products, blogPosts, pages] = await Promise.all([
        meilisearchClient.index(INDEXES.PRODUCTS).search(query, {
          limit: 5,
          attributesToHighlight: ['title', 'brand', 'sku'],
        }).catch(() => emptyResult),
        meilisearchClient.index(INDEXES.BLOG_POSTS).search(query, {
          limit: 3,
          attributesToHighlight: ['title', 'excerpt'],
        }).catch(() => emptyResult),
        meilisearchClient.index(INDEXES.PAGES).search(query, {
          limit: 3,
          attributesToHighlight: ['title', 'content'],
        }).catch(() => emptyResult),
      ])

      const totalResults = (products.estimatedTotalHits || 0) + (blogPosts.estimatedTotalHits || 0) + (pages.estimatedTotalHits || 0)
      const responseTimeMs = Date.now() - startTime

      // Log search (fire-and-forget)
      logSearch({
        query,
        queryType: 'keyword',
        resultsCount: totalResults,
        responseTimeMs,
      }).catch(() => {})

      return NextResponse.json({
        products: {
          hits: products.hits,
          total: products.estimatedTotalHits || 0,
        },
        blogPosts: {
          hits: blogPosts.hits,
          total: blogPosts.estimatedTotalHits || 0,
        },
        pages: {
          hits: pages.hits,
          total: pages.estimatedTotalHits || 0,
        },
        query,
        queryAnalysis: {
          isNaturalLanguage: queryAnalysis.isNaturalLanguage,
          intent: queryAnalysis.intent,
          extractedFilters: queryAnalysis.extractedFilters,
        },
        mode: 'keyword',
        processingTimeMs: responseTimeMs,
      })
    } else {
      // Single index search
      const indexMap: Record<string, string> = {
        products: INDEXES.PRODUCTS,
        'blog-posts': INDEXES.BLOG_POSTS,
        pages: INDEXES.PAGES,
      }
      const indexName = indexMap[type] || INDEXES.PRODUCTS

      const results = await meilisearchClient.index(indexName).search(query, {
        limit,
        attributesToHighlight: ['title', 'brand', 'sku', 'excerpt', 'content'],
      })

      const responseTimeMs = Date.now() - startTime

      // Log search (fire-and-forget)
      logSearch({
        query,
        queryType: 'keyword',
        resultsCount: results.estimatedTotalHits || 0,
        responseTimeMs,
      }).catch(() => {})

      return NextResponse.json({
        hits: results.hits,
        total: results.estimatedTotalHits || 0,
        query,
        mode: 'keyword',
        processingTimeMs: responseTimeMs,
      })
    }
  } catch (error: any) {
    console.error('Search API error:', error)

    return NextResponse.json(
      {
        error: 'Search failed',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
