/**
 * Promotions Cron Endpoint
 *
 * Activeert ingeplande promoties en deactiveert verlopen promoties.
 * Aanroepen via cron of externe scheduler (bijv. elke minuut).
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { activateScheduledPromotions, deactivateExpiredPromotions } from '@/features/promotions/lib/flash-sale-scheduler'

export async function GET(request: Request) {
  try {
    // Verify cron secret (optioneel)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const drizzle = (payload.db as any).drizzle

    console.log('[Cron] Running promotion scheduler...')

    const activated = await activateScheduledPromotions(drizzle)
    const deactivated = await deactivateExpiredPromotions(drizzle)

    const summary = { activated, deactivated }
    console.log('[Cron] Promotion scheduler completed:', JSON.stringify(summary))

    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Cron] Promotion scheduler error:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
