/**
 * Vector Store
 * Uses pgvector with raw SQL via drizzle to store and query embeddings
 */

import { getPayload } from 'payload'
import { sql } from 'drizzle-orm'
import config from '@payload-config'
import type { SimilarityResult } from './types'

/**
 * Get the drizzle database instance from Payload
 */
async function getDB() {
  const payload = await getPayload({ config })
  return (payload.db as any).drizzle
}

/**
 * Upsert an embedding for a document
 * Uses ON CONFLICT to update existing embeddings
 */
export async function upsertEmbedding(
  collectionType: string,
  docId: number,
  embedding: number[],
  metadata?: Record<string, any>,
): Promise<void> {
  const db = await getDB()
  const vectorStr = `[${embedding.join(',')}]`
  const metadataStr = metadata ? JSON.stringify(metadata) : null

  await db.execute(sql`
    INSERT INTO "content_embeddings" ("collection_type", "doc_id", "embedding", "metadata", "updated_at")
    VALUES (${collectionType}, ${docId}, ${vectorStr}::vector, ${metadataStr}::jsonb, now())
    ON CONFLICT ("collection_type", "doc_id")
    DO UPDATE SET
      "embedding" = ${vectorStr}::vector,
      "metadata" = ${metadataStr}::jsonb,
      "updated_at" = now()
  `)
}

/**
 * Search for similar documents using cosine similarity
 * Returns results ordered by similarity score (highest first)
 */
export async function searchSimilar(
  embedding: number[],
  limit: number = 10,
  collectionType?: string,
): Promise<SimilarityResult[]> {
  const db = await getDB()
  const vectorStr = `[${embedding.join(',')}]`

  let result

  if (collectionType) {
    result = await db.execute(sql`
      SELECT
        "doc_id" as id,
        1 - ("embedding" <=> ${vectorStr}::vector) as score,
        "metadata"->>'title' as title,
        "collection_type"
      FROM "content_embeddings"
      WHERE "collection_type" = ${collectionType}
      ORDER BY "embedding" <=> ${vectorStr}::vector
      LIMIT ${limit}
    `)
  } else {
    result = await db.execute(sql`
      SELECT
        "doc_id" as id,
        1 - ("embedding" <=> ${vectorStr}::vector) as score,
        "metadata"->>'title' as title,
        "collection_type"
      FROM "content_embeddings"
      ORDER BY "embedding" <=> ${vectorStr}::vector
      LIMIT ${limit}
    `)
  }

  const rows = result.rows || result
  return (Array.isArray(rows) ? rows : []).map((row: any) => ({
    id: row.id,
    score: parseFloat(row.score) || 0,
    title: row.title || undefined,
  }))
}

/**
 * Delete an embedding for a specific document
 */
export async function deleteEmbedding(
  collectionType: string,
  docId: number,
): Promise<void> {
  const db = await getDB()

  await db.execute(sql`
    DELETE FROM "content_embeddings"
    WHERE "collection_type" = ${collectionType}
      AND "doc_id" = ${docId}
  `)
}
