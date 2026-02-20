import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isMeilisearchAvailable, initializeMeilisearch } from '@/lib/meilisearch/client'
import { reindexAllProducts } from '@/lib/meilisearch/indexProducts'

/**
 * POST /api/meilisearch/reindex
 *
 * Manually reindex all products in Meilisearch
 *
 * Usage:
 * curl -X POST http://localhost:3020/api/meilisearch/reindex \
 *   -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
 *
 * Or from browser (admin only):
 * fetch('/api/meilisearch/reindex', { method: 'POST' })
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Meilisearch is available
    const available = await isMeilisearchAvailable()

    if (!available) {
      return NextResponse.json(
        {
          error: 'Meilisearch is not available',
          message: 'Please start Meilisearch server: meilisearch',
        },
        { status: 503 }
      )
    }

    // Initialize indexes (if not already done)
    await initializeMeilisearch()

    // Get Payload instance
    const payload = await getPayload({ config })

    // Reindex all products
    const success = await reindexAllProducts(payload)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Products reindexed successfully',
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          error: 'Reindex failed',
          message: 'Failed to reindex products. Check server logs.',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Reindex API error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/meilisearch/reindex
 *
 * Check Meilisearch status
 */
export async function GET() {
  try {
    const available = await isMeilisearchAvailable()

    return NextResponse.json({
      available,
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      indexes: {
        products: process.env.MEILISEARCH_PRODUCTS_INDEX || 'products',
        blogPosts: process.env.MEILISEARCH_BLOG_INDEX || 'blog-posts',
        pages: process.env.MEILISEARCH_PAGES_INDEX || 'pages',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        available: false,
        error: error.message,
      },
      { status: 503 }
    )
  }
}
