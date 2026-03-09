import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

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
    const sortBy = searchParams.get('sortBy') || 'revenue'
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    const now = new Date()
    let startDate: string
    let endDate: string

    if (period === 'custom' && from && to) {
      startDate = new Date(from).toISOString()
      const end = new Date(to)
      end.setDate(end.getDate() + 1)
      endDate = end.toISOString()
    } else {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
      const start = new Date(now)
      start.setDate(start.getDate() - days)
      start.setHours(0, 0, 0, 0)
      startDate = start.toISOString()
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
    }

    const db = (payload.db as any).drizzle

    // Top products by revenue
    const byRevenue = await db.execute(sql`
      SELECT
        oi.title,
        oi.sku,
        SUM(oi.quantity)::int as total_quantity,
        COALESCE(SUM(oi.price * oi.quantity), 0)::numeric as total_revenue,
        COUNT(DISTINCT o.id)::int as order_count
      FROM orders_items oi
      JOIN orders o ON o.id = oi._parent_id
      WHERE o.created_at >= ${startDate}::timestamp
        AND o.created_at < ${endDate}::timestamp
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY oi.title, oi.sku
      ORDER BY ${sortBy === 'quantity' ? sql`SUM(oi.quantity)` : sql`SUM(oi.price * oi.quantity)`} DESC
      LIMIT ${limit}
    `)

    const products = (byRevenue.rows || byRevenue || []) as any[]

    return NextResponse.json({
      period,
      startDate,
      endDate,
      products: products.map((row: any) => ({
        title: row.title,
        sku: row.sku,
        totalQuantity: parseInt(row.total_quantity) || 0,
        totalRevenue: Math.round((parseFloat(row.total_revenue) || 0) * 100) / 100,
        orderCount: parseInt(row.order_count) || 0,
      })),
    })
  } catch (error: any) {
    console.error('[analytics/top-products] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
