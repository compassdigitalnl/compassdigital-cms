/**
 * Hybrid Search
 * Combines Meilisearch keyword search with pgvector semantic search
 */

import { meilisearchClient, INDEXES, isMeilisearchAvailable } from '@/features/search/lib/meilisearch/client'
import { aiClient } from '@/features/ai/lib/client'
import { generateEmbedding } from '../embeddings/embedding-service'
import { searchSimilar } from '../embeddings/vector-store'
import { combineScores } from './score-combiner'
import type { HybridSearchOptions, HybridSearchResult } from './types'

/**
 * Perform a hybrid search combining keyword and semantic results
 *
 * Falls back to keyword-only if:
 * - OpenAI API key is not configured
 * - Embedding generation fails
 * - No embeddings exist yet
 */
export async function hybridSearch(
  options: HybridSearchOptions,
): Promise<{
  results: HybridSearchResult[]
  processingTimeMs: number
  mode: 'hybrid' | 'keyword-only'
}> {
  const {
    query,
    limit = 10,
    collections = ['products', 'blog-posts', 'pages'],
    keywordWeight = 0.7,
    semanticWeight = 0.3,
  } = options

  const startTime = Date.now()

  // Check if semantic search is possible
  const canDoSemantic = aiClient.isAvailable()

  // Build index map for the requested collections
  const indexMap: Record<string, string> = {
    products: INDEXES.PRODUCTS,
    'blog-posts': INDEXES.BLOG_POSTS,
    pages: INDEXES.PAGES,
  }

  // Run keyword search (always)
  const keywordPromise = runKeywordSearch(query, collections, indexMap, limit)

  // Run semantic search (if possible)
  const semanticPromise = canDoSemantic
    ? runSemanticSearch(query, limit, collections).catch((err) => {
        console.warn('Semantic search failed, falling back to keyword-only:', err.message)
        return null
      })
    : Promise.resolve(null)

  // Execute in parallel
  const [keywordResults, semanticResults] = await Promise.all([keywordPromise, semanticPromise])

  const processingTimeMs = Date.now() - startTime

  // If no semantic results, return keyword-only
  if (!semanticResults || semanticResults.length === 0) {
    const results: HybridSearchResult[] = keywordResults.map((hit: any, index: number) => ({
      id: hit.id,
      title: hit.title || '',
      slug: hit.slug || '',
      collection: hit._collection || 'products',
      keywordScore: 1 - index / Math.max(keywordResults.length, 1),
      semanticScore: 0,
      combinedScore: 1 - index / Math.max(keywordResults.length, 1),
      ...hit,
    }))

    return {
      results: results.slice(0, limit),
      processingTimeMs,
      mode: 'keyword-only',
    }
  }

  // Combine scores
  const results = combineScores(keywordResults, semanticResults, keywordWeight, semanticWeight)

  return {
    results: results.slice(0, limit),
    processingTimeMs,
    mode: 'hybrid',
  }
}

/**
 * Run keyword search across requested indexes via Meilisearch
 */
async function runKeywordSearch(
  query: string,
  collections: string[],
  indexMap: Record<string, string>,
  limit: number,
): Promise<any[]> {
  const available = await isMeilisearchAvailable()
  if (!available) return []

  const emptyResult = { hits: [] as any[] }

  const searchPromises = collections.map(async (collection) => {
    const indexName = indexMap[collection]
    if (!indexName) return []

    try {
      const result = await meilisearchClient.index(indexName).search(query, {
        limit,
        attributesToHighlight: ['title', 'brand', 'sku', 'excerpt'],
      })

      // Tag each hit with its collection
      return (result.hits || []).map((hit: any) => ({
        ...hit,
        _collection: collection,
      }))
    } catch {
      return []
    }
  })

  const resultArrays = await Promise.all(searchPromises)
  return resultArrays.flat()
}

/**
 * Run semantic search using pgvector
 */
async function runSemanticSearch(
  query: string,
  limit: number,
  collections: string[],
) {
  const embedding = await generateEmbedding(query)

  // For now, search across all collection types
  // Filter by collection type if only one is requested
  const collectionType = collections.length === 1 ? collections[0] : undefined

  return searchSimilar(embedding, limit, collectionType)
}
