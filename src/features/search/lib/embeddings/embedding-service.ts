/**
 * Embedding Service
 * Uses OpenAI text-embedding-3-small to generate vector embeddings
 */

import { aiClient } from '@/features/ai/lib/client'
import { EMBEDDING_CONFIG } from './types'

/**
 * Generate an embedding for a single text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = aiClient.getClient()

  const response = await client.embeddings.create({
    model: EMBEDDING_CONFIG.model,
    input: text.trim(),
    dimensions: EMBEDDING_CONFIG.dimensions,
  })

  return response.data[0].embedding
}

/**
 * Generate embeddings for multiple texts in batch
 * Splits into chunks of EMBEDDING_CONFIG.batchSize to respect API limits
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const client = aiClient.getClient()
  const results: number[][] = []

  // Process in batches
  for (let i = 0; i < texts.length; i += EMBEDDING_CONFIG.batchSize) {
    const batch = texts.slice(i, i + EMBEDDING_CONFIG.batchSize).map((t) => t.trim())

    const response = await client.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: batch,
      dimensions: EMBEDDING_CONFIG.dimensions,
    })

    // Sort by index to maintain order
    const sorted = response.data.sort((a, b) => a.index - b.index)
    results.push(...sorted.map((d) => d.embedding))
  }

  return results
}
