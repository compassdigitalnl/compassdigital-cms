/**
 * Score Combiner
 * Merges keyword and semantic search results with weighted scoring
 */

import type { SimilarityResult } from '../embeddings/types'
import type { HybridSearchResult } from './types'

/**
 * Normalize an array of scores to a 0-1 range
 */
function normalizeScores(scores: number[]): number[] {
  if (scores.length === 0) return []
  const max = Math.max(...scores)
  const min = Math.min(...scores)
  const range = max - min

  if (range === 0) return scores.map(() => 1)
  return scores.map((s) => (s - min) / range)
}

/**
 * Combine keyword (Meilisearch) and semantic (pgvector) results
 * using weighted scoring. Merges by document ID.
 *
 * @param keywordResults - Results from Meilisearch (hits array)
 * @param semanticResults - Results from pgvector cosine similarity
 * @param keywordWeight - Weight for keyword score (0-1)
 * @param semanticWeight - Weight for semantic score (0-1)
 */
export function combineScores(
  keywordResults: any[],
  semanticResults: SimilarityResult[],
  keywordWeight: number = 0.7,
  semanticWeight: number = 0.3,
): HybridSearchResult[] {
  // Build a map of all results keyed by ID
  const resultMap = new Map<string | number, HybridSearchResult>()

  // Normalize keyword scores (use position-based scoring: higher rank = higher score)
  const keywordScoresRaw = keywordResults.map((_, i) => keywordResults.length - i)
  const keywordScoresNorm = normalizeScores(keywordScoresRaw)

  // Process keyword results
  keywordResults.forEach((hit, index) => {
    const id = hit.id || hit.doc_id
    resultMap.set(id, {
      id,
      title: hit.title || '',
      slug: hit.slug || '',
      collection: hit._collection || 'products',
      keywordScore: keywordScoresNorm[index] || 0,
      semanticScore: 0,
      combinedScore: 0,
      ...hit,
    })
  })

  // Normalize semantic scores
  const semanticScoresRaw = semanticResults.map((r) => r.score)
  const semanticScoresNorm = normalizeScores(semanticScoresRaw)

  // Process semantic results
  semanticResults.forEach((result, index) => {
    const id = result.id
    const existing = resultMap.get(id)

    if (existing) {
      existing.semanticScore = semanticScoresNorm[index] || 0
    } else {
      resultMap.set(id, {
        id,
        title: result.title || '',
        slug: '',
        collection: 'products',
        keywordScore: 0,
        semanticScore: semanticScoresNorm[index] || 0,
        combinedScore: 0,
      })
    }
  })

  // Calculate combined scores and sort
  const results = Array.from(resultMap.values()).map((result) => ({
    ...result,
    combinedScore:
      result.keywordScore * keywordWeight + result.semanticScore * semanticWeight,
  }))

  results.sort((a, b) => b.combinedScore - a.combinedScore)

  return results
}
