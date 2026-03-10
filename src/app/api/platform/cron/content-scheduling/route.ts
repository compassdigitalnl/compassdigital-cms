/**
 * Content Scheduling Cron Endpoint
 *
 * Publishes/unpublishes content based on scheduled dates.
 * Call every minute via cron or external scheduler.
 */

import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
    const payload = await getPayloadClient()
    const drizzle = (payload.db as any).drizzle
    const now = new Date()

    console.log('[Cron] Running content scheduling...')

    const collections = ['pages', 'blog_posts', 'products']
    const summary: Record<string, { published: number; unpublished: number }> = {}

    for (const table of collections) {
      // Publish scheduled drafts
      const pubResult = await drizzle.execute(
        sql.raw(`
          UPDATE "${table}"
          SET status = 'published', publish_at = NULL, updated_at = NOW()
          WHERE publish_at IS NOT NULL
            AND publish_at <= '${now.toISOString()}'
            AND status = 'draft'
        `),
      )

      // Unpublish scheduled published content
      const targetStatus = table === 'products' ? 'archived' : 'draft'
      const unpubResult = await drizzle.execute(
        sql.raw(`
          UPDATE "${table}"
          SET status = '${targetStatus}', unpublish_at = NULL, updated_at = NOW()
          WHERE unpublish_at IS NOT NULL
            AND unpublish_at <= '${now.toISOString()}'
            AND status = 'published'
        `),
      )

      summary[table] = {
        published: pubResult?.rowCount || 0,
        unpublished: unpubResult?.rowCount || 0,
      }
    }

    console.log('[Cron] Content scheduling completed:', JSON.stringify(summary))

    return NextResponse.json({
      success: true,
      summary,
      timestamp: now.toISOString(),
    })
  } catch (error: unknown) {
    console.error('[Cron] Content scheduling error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
