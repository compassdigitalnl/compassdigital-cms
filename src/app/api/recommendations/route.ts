import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import {
  getSimilarProducts,
  getAlsoBoughtProducts,
  getRecentlyViewedRecommendations,
  getTrendingProducts,
  getPersonalizedRecommendations,
} from '@/features/ai/lib/RecommendationService'
import type { RecommendationType } from '@/features/ai/lib/RecommendationService'

/**
 * GET /api/recommendations?type=similar&productId=123&limit=8
 *
 * Types:
 * - similar: Products similar to the given product (content-based via pgvector)
 * - also-bought: Products often bought together (collaborative filtering)
 * - recently-viewed: Recommendations based on user's browsing history
 * - trending: Popular products by recent order volume
 * - personalized: Mix of all strategies
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = (searchParams.get('type') || 'personalized') as RecommendationType
    const productId = searchParams.get('productId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 24)

    // Get authenticated user (optional)
    let userId: number | undefined
    try {
      const payload = await getPayloadHMR({ config: configPromise })
      const { user } = await payload.auth({ headers: request.headers })
      userId = user?.id
    } catch {
      // Anonymous user — fine
    }

    const parsedProductId = productId ? parseInt(productId) : undefined

    let recommendations

    switch (type) {
      case 'similar':
        if (!parsedProductId) {
          return NextResponse.json({ error: 'productId is required for similar' }, { status: 400 })
        }
        recommendations = await getSimilarProducts(parsedProductId, { limit })
        break

      case 'also-bought':
        if (!parsedProductId) {
          return NextResponse.json({ error: 'productId is required for also-bought' }, { status: 400 })
        }
        recommendations = await getAlsoBoughtProducts(parsedProductId, { limit })
        break

      case 'recently-viewed':
        if (!userId) {
          return NextResponse.json({ success: true, recommendations: [], reason: 'not-authenticated' })
        }
        recommendations = await getRecentlyViewedRecommendations(userId, { limit })
        break

      case 'trending':
        recommendations = await getTrendingProducts({ limit })
        break

      case 'personalized':
      default:
        recommendations = await getPersonalizedRecommendations(userId, parsedProductId, { limit })
        break
    }

    // Hydrate product data for the frontend
    if (recommendations.length > 0) {
      try {
        const payload = await getPayloadHMR({ config: configPromise })
        const productIds = recommendations.map((r) => r.id)

        const { docs: products } = await payload.find({
          collection: 'products',
          where: { id: { in: productIds } },
          depth: 1,
          limit: productIds.length,
        })

        const productMap = new Map(products.map((p) => [p.id, p]))

        const hydrated = recommendations
          .map((rec) => ({
            ...rec,
            product: productMap.get(rec.id) || null,
          }))
          .filter((r) => r.product !== null)

        return NextResponse.json({
          success: true,
          type,
          recommendations: hydrated,
        })
      } catch (error) {
        console.error('[Recommendations API] Hydration error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      type,
      recommendations,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations', message },
      { status: 500 },
    )
  }
}
