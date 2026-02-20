import { NextRequest, NextResponse } from 'next/server'
import { meilisearchClient, INDEXES, isMeilisearchAvailable } from '@/lib/meilisearch/client'

/**
 * GET /api/search?q=query&type=products
 *
 * Instant search API for products, blog posts, and pages
 *
 * Query params:
 * - q: search query (required)
 * - type: 'products' | 'blog-posts' | 'pages' | 'all' (default: 'all')
 * - limit: number of results (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10', 10)

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

    // Search based on type
    if (type === 'all') {
      // Multi-index search
      const [products, blogPosts] = await Promise.all([
        meilisearchClient.index(INDEXES.PRODUCTS).search(query, {
          limit: 5,
          attributesToHighlight: ['title', 'brand', 'sku'],
        }),
        meilisearchClient.index(INDEXES.BLOG_POSTS).search(query, {
          limit: 3,
          attributesToHighlight: ['title', 'excerpt'],
        }),
      ])

      return NextResponse.json({
        products: {
          hits: products.hits,
          total: products.estimatedTotalHits || 0,
        },
        blogPosts: {
          hits: blogPosts.hits,
          total: blogPosts.estimatedTotalHits || 0,
        },
        query,
        processingTimeMs: products.processingTimeMs + blogPosts.processingTimeMs,
      })
    } else {
      // Single index search
      const indexName = type === 'products' ? INDEXES.PRODUCTS : INDEXES.BLOG_POSTS

      const results = await meilisearchClient.index(indexName).search(query, {
        limit,
        attributesToHighlight: ['title', 'brand', 'sku', 'excerpt'],
      })

      return NextResponse.json({
        hits: results.hits,
        total: results.estimatedTotalHits || 0,
        query,
        processingTimeMs: results.processingTimeMs,
      })
    }
  } catch (error: any) {
    console.error('❌ Search API error:', error)

    return NextResponse.json(
      {
        error: 'Search failed',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
