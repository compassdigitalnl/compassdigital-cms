import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getSearchAnalytics, getTopQueries, getZeroResultQueries } from '@/features/search/lib/analytics/search-analytics'

/**
 * GET /api/search/analytics?days=30
 * Search analytics dashboard data (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { user } = await payload.auth({ headers: request.headers })
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const days = parseInt(request.nextUrl.searchParams.get('days') || '30', 10)

    const [summary, topQueries, zeroResultQueries] = await Promise.all([
      getSearchAnalytics(days),
      getTopQueries(days, 20),
      getZeroResultQueries(days, 20),
    ])

    return NextResponse.json({
      success: true,
      ...summary,
      topQueries,
      zeroResultQueries,
    })
  } catch (error: any) {
    console.error('[Search Analytics] Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
