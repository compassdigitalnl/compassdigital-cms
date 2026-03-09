/**
 * Search Logger
 * Fire-and-forget logging of search queries and clicks to search_analytics table
 */

import { getPayload } from 'payload'
import { sql } from 'drizzle-orm'
import config from '@payload-config'
import type { SearchLogEntry, SearchClickEntry } from './types'

/**
 * Get the drizzle database instance from Payload
 */
async function getDB() {
  const payload = await getPayload({ config })
  return (payload.db as any).drizzle
}

/**
 * Log a search query (fire-and-forget)
 * Does not throw — errors are silently logged to console
 */
export async function logSearch(entry: SearchLogEntry): Promise<void> {
  try {
    const db = await getDB()

    await db.execute(sql`
      INSERT INTO "search_analytics" (
        "query", "query_type", "results_count", "response_time_ms",
        "session_id", "user_id", "created_at"
      )
      VALUES (
        ${entry.query},
        ${entry.queryType},
        ${entry.resultsCount},
        ${entry.responseTimeMs},
        ${entry.sessionId || null},
        ${entry.userId || null},
        now()
      )
    `)
  } catch (err) {
    console.error('Failed to log search:', err)
  }
}

/**
 * Log a search result click (fire-and-forget)
 * Does not throw — errors are silently logged to console
 */
export async function logClick(entry: SearchClickEntry): Promise<void> {
  try {
    const db = await getDB()

    await db.execute(sql`
      INSERT INTO "search_analytics" (
        "query", "query_type", "clicked_id", "clicked_collection",
        "clicked_position", "session_id", "created_at"
      )
      VALUES (
        ${entry.query},
        'click',
        ${entry.clickedId},
        ${entry.clickedCollection},
        ${entry.clickedPosition},
        ${entry.sessionId || null},
        now()
      )
    `)
  } catch (err) {
    console.error('Failed to log click:', err)
  }
}
