#!/usr/bin/env tsx
/**
 * Content Scheduling Cron Job
 *
 * Publishes/unpublishes content based on scheduled dates.
 * Handles Pages, BlogPosts, and Products.
 *
 * Usage:
 *   npx tsx src/scripts/cron/content-scheduling.ts
 *
 * Crontab:
 *   * * * * * cd /app && npx tsx src/scripts/cron/content-scheduling.ts
 */

import { sql } from 'drizzle-orm'

async function getDB() {
  const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
  const payload = await getPayloadClient()
  const drizzle = (payload.db as any).drizzle
  return { payload, drizzle }
}

interface ScheduleResult {
  collection: string
  published: number
  unpublished: number
  errors: string[]
}

/**
 * Process scheduled publishes for a collection
 */
async function processPublish(
  drizzle: any,
  table: string,
  now: Date,
): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = []
  try {
    const result = await drizzle.execute(
      sql.raw(`
        UPDATE "${table}"
        SET status = 'published',
            updated_at = NOW()
        WHERE publish_at IS NOT NULL
          AND publish_at <= '${now.toISOString()}'
          AND status = 'draft'
        RETURNING id, title
      `),
    )
    const rows = result?.rows || []
    if (rows.length > 0) {
      for (const row of rows) {
        console.log(`  ✅ Published ${table}/${row.id}: "${row.title}"`)
      }
    }
    return { count: rows.length, errors }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    errors.push(`${table} publish: ${message}`)
    return { count: 0, errors }
  }
}

/**
 * Process scheduled unpublishes for a collection
 */
async function processUnpublish(
  drizzle: any,
  table: string,
  now: Date,
): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = []
  try {
    // Use 'archived' for products (which support it), 'draft' for others
    const targetStatus = table === 'products' ? 'archived' : 'draft'

    const result = await drizzle.execute(
      sql.raw(`
        UPDATE "${table}"
        SET status = '${targetStatus}',
            unpublish_at = NULL,
            updated_at = NOW()
        WHERE unpublish_at IS NOT NULL
          AND unpublish_at <= '${now.toISOString()}'
          AND status = 'published'
        RETURNING id, title
      `),
    )
    const rows = result?.rows || []
    if (rows.length > 0) {
      for (const row of rows) {
        console.log(`  📤 Unpublished ${table}/${row.id}: "${row.title}" → ${targetStatus}`)
      }
    }
    return { count: rows.length, errors }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    errors.push(`${table} unpublish: ${message}`)
    return { count: 0, errors }
  }
}

/**
 * Clear publish_at after successful publish (so it doesn't re-trigger)
 */
async function clearProcessedSchedules(drizzle: any, table: string, now: Date): Promise<void> {
  try {
    await drizzle.execute(
      sql.raw(`
        UPDATE "${table}"
        SET publish_at = NULL
        WHERE publish_at IS NOT NULL
          AND publish_at <= '${now.toISOString()}'
          AND status = 'published'
      `),
    )
  } catch {
    // Non-critical
  }
}

/**
 * Revalidate published/unpublished pages so Next.js serves fresh content
 */
async function revalidateChangedContent(
  payload: any,
  table: string,
  ids: number[],
): Promise<void> {
  if (ids.length === 0) return
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
    if (!baseUrl) return

    for (const id of ids) {
      // Fire-and-forget revalidation
      fetch(`${baseUrl}/api/revalidate?collection=${table}&id=${id}`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': process.env.REVALIDATION_KEY || '' },
      }).catch(() => {})
    }
  } catch {
    // Non-critical
  }
}

/**
 * Main scheduling function
 */
async function runContentScheduling() {
  const startTime = Date.now()
  const now = new Date()

  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`📅 CONTENT SCHEDULING — ${now.toISOString()}`)
  console.log('═══════════════════════════════════════════════════════════════')

  const { drizzle } = await getDB()

  const collections = ['pages', 'blog_posts', 'products']
  const results: ScheduleResult[] = []

  for (const table of collections) {
    console.log(`\n[${table}]`)

    const pubResult = await processPublish(drizzle, table, now)
    const unpubResult = await processUnpublish(drizzle, table, now)

    // Clear processed publish_at timestamps
    if (pubResult.count > 0) {
      await clearProcessedSchedules(drizzle, table, now)
    }

    results.push({
      collection: table,
      published: pubResult.count,
      unpublished: unpubResult.count,
      errors: [...pubResult.errors, ...unpubResult.errors],
    })

    if (pubResult.count === 0 && unpubResult.count === 0) {
      console.log('  — Geen wijzigingen')
    }
  }

  // Summary
  const totalPublished = results.reduce((s, r) => s + r.published, 0)
  const totalUnpublished = results.reduce((s, r) => s + r.unpublished, 0)
  const totalErrors = results.reduce((s, r) => s + r.errors.length, 0)
  const duration = Date.now() - startTime

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log(
    `✅ DONE (${duration}ms) — ${totalPublished} gepubliceerd, ${totalUnpublished} gedepubliceerd, ${totalErrors} fouten`,
  )
  console.log('═══════════════════════════════════════════════════════════════\n')

  if (totalErrors > 0) {
    for (const r of results) {
      for (const err of r.errors) {
        console.error(`❌ ${err}`)
      }
    }
  }

  process.exit(totalErrors > 0 ? 1 : 0)
}

// Run if called directly
if (require.main === module) {
  runContentScheduling()
}

export { runContentScheduling }
