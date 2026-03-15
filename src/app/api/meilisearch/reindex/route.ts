import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isMeilisearchAvailable, initializeMeilisearch } from '@/features/search/lib/meilisearch/client'
import { reindexAllProducts } from '@/features/search/lib/meilisearch/indexProducts'
import { reindexAllBlogPosts } from '@/features/search/lib/meilisearch/indexBlogPosts'
import { reindexAllPages } from '@/features/search/lib/meilisearch/indexPages'
import { getMeilisearchSettings, mergeSettings, isCollectionIndexed } from '@/features/search/lib/meilisearch/settings'

/**
 * POST /api/meilisearch/reindex
 *
 * Manually reindex all enabled collections in Meilisearch.
 * Requires admin authentication.
 *
 * Usage:
 * curl -X POST http://localhost:3020/api/meilisearch/reindex \
 *   -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate — admin only
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user || !('roles' in user) || !(user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Initialize indexes (if not already done) with CMS settings
    await initializeMeilisearch(payload)

    // Get settings to check which collections are enabled
    const cmsSettings = await getMeilisearchSettings(payload)
    const settings = mergeSettings(cmsSettings)

    // Reindex per enabled collection
    const results: Record<string, boolean> = {}

    if (isCollectionIndexed('products', settings)) {
      results.products = await reindexAllProducts(payload)
    }

    if (isCollectionIndexed('blog-posts', settings)) {
      results.blogPosts = await reindexAllBlogPosts(payload)
    }

    if (isCollectionIndexed('pages', settings)) {
      results.pages = await reindexAllPages(payload)
    }

    const allSuccess = Object.values(results).every(Boolean)
    const anySuccess = Object.values(results).some(Boolean)

    if (allSuccess) {
      return NextResponse.json({
        success: true,
        message: 'All collections reindexed successfully',
        results,
        timestamp: new Date().toISOString(),
      })
    } else if (anySuccess) {
      return NextResponse.json({
        success: true,
        message: 'Some collections reindexed (check results for details)',
        results,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          error: 'Reindex failed',
          message: 'Failed to reindex collections. Check server logs.',
          results,
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('❌ Reindex API error:', error)
    const message = error instanceof Error ? error.message : String(error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: message || 'Unknown error occurred',
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        available: false,
        error: message,
      },
      { status: 503 }
    )
  }
}
