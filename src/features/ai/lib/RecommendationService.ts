/**
 * AI Product Recommendation Service (Feature #1)
 *
 * Combines multiple recommendation strategies:
 * 1. Content-based: Similar products via pgvector cosine similarity
 * 2. Collaborative: "Users who bought X also bought Y" via order data
 * 3. Recently viewed: Personalized based on browsing history
 * 4. Trending: Popular products by recent order volume
 *
 * Falls back gracefully if embeddings are not available.
 */

import { getPayload } from 'payload'
import { sql } from 'drizzle-orm'
import config from '@payload-config'
import { generateEmbedding } from '@/features/search/lib/embeddings/embedding-service'
import { buildEmbeddingText } from '@/features/search/lib/embeddings/product-embedder'

export type RecommendationType =
  | 'similar'          // Content-based similar products
  | 'also-bought'      // Collaborative: bought together
  | 'recently-viewed'  // Personalized: based on browsing
  | 'trending'         // Popular products
  | 'personalized'     // Mix of all strategies

export interface RecommendedProduct {
  id: number
  score: number
  reason: RecommendationType
  title?: string
  slug?: string
}

interface RecommendationOptions {
  limit?: number
  excludeProductIds?: number[]
}

/**
 * Get similar products based on vector similarity (content-based)
 */
export async function getSimilarProducts(
  productId: number,
  options: RecommendationOptions = {},
): Promise<RecommendedProduct[]> {
  const { limit = 8, excludeProductIds = [] } = options

  try {
    const payload = await getPayload({ config })
    const db = (payload.db as Record<string, unknown>).drizzle as {
      execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>
    }

    // Get the product's embedding
    const embeddingResult = await db.execute(sql`
      SELECT embedding FROM content_embeddings
      WHERE collection_type = 'products' AND doc_id = ${productId}
      LIMIT 1
    `)

    const rows = embeddingResult.rows || embeddingResult
    if (!Array.isArray(rows) || rows.length === 0) {
      // No embedding found — fallback to same-category products
      return getFallbackSimilar(productId, limit, excludeProductIds)
    }

    // Build exclude list
    const allExclude = [productId, ...excludeProductIds]
    const excludeStr = allExclude.join(',')

    // Search for similar products using cosine similarity
    const result = await db.execute(sql`
      SELECT
        ce.doc_id as id,
        1 - (ce.embedding <=> (
          SELECT embedding FROM content_embeddings
          WHERE collection_type = 'products' AND doc_id = ${productId}
        )) as score,
        ce.metadata->>'title' as title,
        ce.metadata->>'slug' as slug
      FROM content_embeddings ce
      INNER JOIN products p ON p.id = ce.doc_id
      WHERE ce.collection_type = 'products'
        AND ce.doc_id NOT IN (${sql.raw(excludeStr)})
        AND p._status = 'published'
      ORDER BY ce.embedding <=> (
        SELECT embedding FROM content_embeddings
        WHERE collection_type = 'products' AND doc_id = ${productId}
      )
      LIMIT ${limit}
    `)

    const similarRows = result.rows || result
    return (Array.isArray(similarRows) ? similarRows : []).map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      score: parseFloat(String(row.score)) || 0,
      reason: 'similar' as const,
      title: String(row.title || ''),
      slug: String(row.slug || ''),
    }))
  } catch (error) {
    console.error('[Recommendations] Similar products error:', error)
    return []
  }
}

/**
 * Fallback: Get products from the same category when no embeddings exist
 */
async function getFallbackSimilar(
  productId: number,
  limit: number,
  excludeProductIds: number[],
): Promise<RecommendedProduct[]> {
  try {
    const payload = await getPayload({ config })

    // Get the product's categories
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 0,
    })

    const categoryIds = Array.isArray(product.categories)
      ? product.categories.map((c: number | { id: number }) => typeof c === 'object' ? c.id : c)
      : []

    if (categoryIds.length === 0) return []

    const allExclude = [productId, ...excludeProductIds]

    const { docs } = await payload.find({
      collection: 'products',
      where: {
        id: { not_in: allExclude },
        categories: { in: categoryIds },
        _status: { equals: 'published' },
      },
      limit,
      sort: '-updatedAt',
      depth: 0,
    })

    return docs.map((doc, i) => ({
      id: doc.id,
      score: 0.5 - (i * 0.05), // Decreasing pseudo-score
      reason: 'similar' as const,
      title: doc.title || '',
      slug: doc.slug || '',
    }))
  } catch {
    return []
  }
}

/**
 * Get "also bought" products based on order history (collaborative filtering)
 */
export async function getAlsoBoughtProducts(
  productId: number,
  options: RecommendationOptions = {},
): Promise<RecommendedProduct[]> {
  const { limit = 8, excludeProductIds = [] } = options

  try {
    const payload = await getPayload({ config })
    const db = (payload.db as Record<string, unknown>).drizzle as {
      execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>
    }

    const allExclude = [productId, ...excludeProductIds]
    const excludeStr = allExclude.join(',')

    // Find products that appear in orders together with the given product
    const result = await db.execute(sql`
      WITH orders_with_product AS (
        SELECT DISTINCT oi._parent_id as order_id
        FROM orders_items oi
        WHERE oi.product_id = ${productId}
      )
      SELECT
        oi.product_id as id,
        COUNT(*) as co_purchase_count,
        p.title,
        p.slug
      FROM orders_items oi
      INNER JOIN orders_with_product owp ON oi._parent_id = owp.order_id
      INNER JOIN products p ON p.id = oi.product_id
      WHERE oi.product_id NOT IN (${sql.raw(excludeStr)})
        AND p._status = 'published'
      GROUP BY oi.product_id, p.title, p.slug
      ORDER BY co_purchase_count DESC
      LIMIT ${limit}
    `)

    const rows = result.rows || result
    if (!Array.isArray(rows) || rows.length === 0) return []

    const maxCount = Number(rows[0].co_purchase_count) || 1

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      score: (Number(row.co_purchase_count) || 0) / maxCount, // Normalize to 0-1
      reason: 'also-bought' as const,
      title: String(row.title || ''),
      slug: String(row.slug || ''),
    }))
  } catch (error) {
    console.error('[Recommendations] Also-bought error:', error)
    return []
  }
}

/**
 * Get recommendations based on user's recently viewed products
 */
export async function getRecentlyViewedRecommendations(
  userId: number,
  options: RecommendationOptions = {},
): Promise<RecommendedProduct[]> {
  const { limit = 8, excludeProductIds = [] } = options

  try {
    const payload = await getPayload({ config })

    // Get user's recently viewed products
    const { docs: recentViews } = await payload.find({
      collection: 'recently-viewed',
      where: { user: { equals: userId } },
      sort: '-createdAt',
      limit: 5,
      depth: 0,
    })

    if (recentViews.length === 0) return []

    // Get similar products for each recently viewed item
    const allRecommendations: RecommendedProduct[] = []
    const seenIds = new Set(excludeProductIds)
    const viewedIds = recentViews.map((v) =>
      typeof v.product === 'object' && v.product !== null ? (v.product as { id: number }).id : Number(v.product),
    )

    for (const viewedId of viewedIds) {
      seenIds.add(viewedId)
    }

    for (const viewedId of viewedIds.slice(0, 3)) {
      const similar = await getSimilarProducts(viewedId, {
        limit: 4,
        excludeProductIds: [...seenIds],
      })

      for (const rec of similar) {
        if (!seenIds.has(rec.id)) {
          seenIds.add(rec.id)
          allRecommendations.push({
            ...rec,
            reason: 'recently-viewed',
          })
        }
      }
    }

    return allRecommendations.slice(0, limit)
  } catch (error) {
    console.error('[Recommendations] Recently-viewed error:', error)
    return []
  }
}

/**
 * Get trending products based on recent order volume
 */
export async function getTrendingProducts(
  options: RecommendationOptions = {},
): Promise<RecommendedProduct[]> {
  const { limit = 8, excludeProductIds = [] } = options

  try {
    const payload = await getPayload({ config })
    const db = (payload.db as Record<string, unknown>).drizzle as {
      execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>
    }

    const excludeStr = excludeProductIds.length > 0 ? excludeProductIds.join(',') : '0'

    // Products ordered most in the last 30 days
    const result = await db.execute(sql`
      SELECT
        oi.product_id as id,
        COUNT(*) as order_count,
        SUM(oi.quantity) as total_quantity,
        p.title,
        p.slug
      FROM orders_items oi
      INNER JOIN orders o ON o.id = oi._parent_id
      INNER JOIN products p ON p.id = oi.product_id
      WHERE o.created_at > NOW() - INTERVAL '30 days'
        AND p._status = 'published'
        AND oi.product_id NOT IN (${sql.raw(excludeStr)})
      GROUP BY oi.product_id, p.title, p.slug
      ORDER BY total_quantity DESC
      LIMIT ${limit}
    `)

    const rows = result.rows || result
    if (!Array.isArray(rows) || rows.length === 0) return []

    const maxQty = Number(rows[0].total_quantity) || 1

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      score: (Number(row.total_quantity) || 0) / maxQty,
      reason: 'trending' as const,
      title: String(row.title || ''),
      slug: String(row.slug || ''),
    }))
  } catch (error) {
    console.error('[Recommendations] Trending error:', error)
    return []
  }
}

/**
 * Get personalized recommendations (mix of all strategies)
 * Priority: recently-viewed > also-bought > similar > trending
 */
export async function getPersonalizedRecommendations(
  userId?: number,
  productId?: number,
  options: RecommendationOptions = {},
): Promise<RecommendedProduct[]> {
  const { limit = 12, excludeProductIds = [] } = options
  const results: RecommendedProduct[] = []
  const seenIds = new Set(excludeProductIds)

  const addResults = (recs: RecommendedProduct[]) => {
    for (const rec of recs) {
      if (!seenIds.has(rec.id) && results.length < limit) {
        seenIds.add(rec.id)
        results.push(rec)
      }
    }
  }

  // 1. Recently viewed recommendations (if user is known)
  if (userId) {
    const recentRecs = await getRecentlyViewedRecommendations(userId, {
      limit: 4,
      excludeProductIds: [...seenIds],
    })
    addResults(recentRecs)
  }

  // 2. Also bought (if product context is available)
  if (productId) {
    seenIds.add(productId)
    const alsoBought = await getAlsoBoughtProducts(productId, {
      limit: 4,
      excludeProductIds: [...seenIds],
    })
    addResults(alsoBought)
  }

  // 3. Similar products (if product context)
  if (productId && results.length < limit) {
    const similar = await getSimilarProducts(productId, {
      limit: 4,
      excludeProductIds: [...seenIds],
    })
    addResults(similar)
  }

  // 4. Fill remaining with trending
  if (results.length < limit) {
    const trending = await getTrendingProducts({
      limit: limit - results.length,
      excludeProductIds: [...seenIds],
    })
    addResults(trending)
  }

  return results
}
