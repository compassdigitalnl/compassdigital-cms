import { NextResponse } from 'next/server'
import { logClick } from '@/features/search/lib/analytics/search-logger'

/**
 * POST /api/search/click
 * Log a search result click for analytics
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, clickedId, clickedCollection, clickedPosition } = body

    if (!query || clickedId === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await logClick({
      query,
      clickedId: Number(clickedId),
      clickedCollection: clickedCollection || 'unknown',
      clickedPosition: clickedPosition || 0,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Non-critical — don't fail loudly
    return NextResponse.json({ success: false })
  }
}
