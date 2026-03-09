/**
 * Search Analytics
 * Aggregated analytics queries on the search_analytics table
 */

import { getPayload } from 'payload'
import { sql } from 'drizzle-orm'
import config from '@payload-config'
import type { SearchAnalyticsSummary } from './types'

/**
 * Get the drizzle database instance from Payload
 */
async function getDB() {
  const payload = await getPayload({ config })
  return (payload.db as any).drizzle
}

/**
 * Get aggregated search analytics for the specified number of days
 */
export async function getSearchAnalytics(days: number = 30): Promise<SearchAnalyticsSummary> {
  const db = await getDB()

  // Total searches (exclude clicks)
  const totalResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "search_analytics"
    WHERE "query_type" != 'click'
      AND "created_at" >= now() - ${`${days} days`}::interval
  `)
  const totalSearches = parseInt(totalResult.rows?.[0]?.count || '0', 10)

  // Unique queries
  const uniqueResult = await db.execute(sql`
    SELECT COUNT(DISTINCT "query") as count
    FROM "search_analytics"
    WHERE "query_type" != 'click'
      AND "created_at" >= now() - ${`${days} days`}::interval
  `)
  const uniqueQueries = parseInt(uniqueResult.rows?.[0]?.count || '0', 10)

  // Zero result queries
  const zeroResults = await getZeroResultQueries(days, 20)

  // Top queries
  const topQueries = await getTopQueries(days, 20)

  // Average response time
  const avgResult = await db.execute(sql`
    SELECT AVG("response_time_ms") as avg_time
    FROM "search_analytics"
    WHERE "query_type" != 'click'
      AND "response_time_ms" IS NOT NULL
      AND "created_at" >= now() - ${`${days} days`}::interval
  `)
  const avgResponseTime = parseFloat(avgResult.rows?.[0]?.avg_time || '0')

  // Click-through rate
  const clickResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "search_analytics"
    WHERE "query_type" = 'click'
      AND "created_at" >= now() - ${`${days} days`}::interval
  `)
  const totalClicks = parseInt(clickResult.rows?.[0]?.count || '0', 10)
  const clickThroughRate = totalSearches > 0 ? totalClicks / totalSearches : 0

  return {
    totalSearches,
    uniqueQueries,
    zeroResultQueries: zeroResults,
    topQueries,
    avgResponseTime: Math.round(avgResponseTime * 100) / 100,
    clickThroughRate: Math.round(clickThroughRate * 10000) / 10000,
  }
}

/**
 * Get queries that returned zero results
 */
export async function getZeroResultQueries(
  days: number = 30,
  limit: number = 20,
): Promise<string[]> {
  const db = await getDB()

  const result = await db.execute(sql`
    SELECT "query", COUNT(*) as count
    FROM "search_analytics"
    WHERE "results_count" = 0
      AND "query_type" != 'click'
      AND "created_at" >= now() - ${`${days} days`}::interval
    GROUP BY "query"
    ORDER BY count DESC
    LIMIT ${limit}
  `)

  const rows = result.rows || result
  return (Array.isArray(rows) ? rows : []).map((row: any) => row.query)
}

/**
 * Get top search queries by frequency
 */
export async function getTopQueries(
  days: number = 30,
  limit: number = 20,
): Promise<{ query: string; count: number }[]> {
  const db = await getDB()

  const result = await db.execute(sql`
    SELECT "query", COUNT(*) as count
    FROM "search_analytics"
    WHERE "query_type" != 'click'
      AND "created_at" >= now() - ${`${days} days`}::interval
    GROUP BY "query"
    ORDER BY count DESC
    LIMIT ${limit}
  `)

  const rows = result.rows || result
  return (Array.isArray(rows) ? rows : []).map((row: any) => ({
    query: row.query,
    count: parseInt(row.count, 10),
  }))
}
