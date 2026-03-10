import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

function parsePeriod(period: string, from?: string, to?: string) {
  const now = new Date()
  let startDate: Date
  let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  if (period === 'custom' && from && to) {
    startDate = new Date(from)
    endDate = new Date(to)
    endDate.setDate(endDate.getDate() + 1)
  } else {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)
  }

  const periodLength = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const prevStartDate = new Date(startDate)
  prevStartDate.setDate(prevStartDate.getDate() - periodLength)

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    prevStartDate: prevStartDate.toISOString(),
    prevEndDate: startDate.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || !('roles' in user) || !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined

    const { startDate, endDate, prevStartDate, prevEndDate } = parsePeriod(period, from, to)
    const db = (payload.db as any).drizzle

    // Current period - daily breakdown
    const dailyResult = await db.execute(sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*)::int as order_count,
        COALESCE(SUM(total), 0)::numeric as revenue,
        COALESCE(AVG(total), 0)::numeric as aov
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE(created_at)
      ORDER BY date
    `)

    // Current period totals
    const currentTotals = await db.execute(sql`
      SELECT
        COUNT(*)::int as order_count,
        COALESCE(SUM(total), 0)::numeric as revenue,
        COALESCE(AVG(total), 0)::numeric as aov
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status NOT IN ('cancelled', 'refunded')
    `)

    // Previous period totals (for comparison)
    const prevTotals = await db.execute(sql`
      SELECT
        COUNT(*)::int as order_count,
        COALESCE(SUM(total), 0)::numeric as revenue,
        COALESCE(AVG(total), 0)::numeric as aov
      FROM orders
      WHERE created_at >= ${prevStartDate}::timestamp
        AND created_at < ${prevEndDate}::timestamp
        AND status NOT IN ('cancelled', 'refunded')
    `)

    const current = currentTotals.rows?.[0] || currentTotals[0] || {}
    const previous = prevTotals.rows?.[0] || prevTotals[0] || {}
    const daily = dailyResult.rows || dailyResult || []

    const currentRevenue = parseFloat(current.revenue) || 0
    const previousRevenue = parseFloat(previous.revenue) || 0
    const currentOrders = parseInt(current.order_count) || 0
    const previousOrders = parseInt(previous.order_count) || 0
    const currentAov = parseFloat(current.aov) || 0
    const previousAov = parseFloat(previous.aov) || 0

    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : currentRevenue > 0 ? 100 : 0

    const ordersChange = previousOrders > 0
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : currentOrders > 0 ? 100 : 0

    const aovChange = previousAov > 0
      ? ((currentAov - previousAov) / previousAov) * 100
      : currentAov > 0 ? 100 : 0

    return NextResponse.json({
      period,
      startDate,
      endDate,
      totals: {
        revenue: Math.round(currentRevenue * 100) / 100,
        orderCount: currentOrders,
        aov: Math.round(currentAov * 100) / 100,
      },
      comparison: {
        revenue: { previous: Math.round(previousRevenue * 100) / 100, change: Math.round(revenueChange * 10) / 10 },
        orderCount: { previous: previousOrders, change: Math.round(ordersChange * 10) / 10 },
        aov: { previous: Math.round(previousAov * 100) / 100, change: Math.round(aovChange * 10) / 10 },
      },
      daily: (daily as any[]).map((row: any) => ({
        date: row.date,
        orderCount: parseInt(row.order_count) || 0,
        revenue: Math.round((parseFloat(row.revenue) || 0) * 100) / 100,
        aov: Math.round((parseFloat(row.aov) || 0) * 100) / 100,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[analytics/revenue] Error:', error)
    return NextResponse.json({ error: message || 'Internal server error' }, { status: 500 })
  }
}
