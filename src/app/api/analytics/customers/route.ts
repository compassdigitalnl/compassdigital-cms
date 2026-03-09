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

    // New customers: first order falls within this period
    const newCustomersResult = await db.execute(sql`
      SELECT COUNT(*)::int as new_customers
      FROM (
        SELECT COALESCE(customer_id::text, guest_email) as customer_key
        FROM orders
        WHERE status NOT IN ('cancelled', 'refunded')
        GROUP BY COALESCE(customer_id::text, guest_email)
        HAVING MIN(created_at) >= ${startDate}::timestamp
          AND MIN(created_at) < ${endDate}::timestamp
      ) first_orders
    `)

    // Returning customers: had an order before this period AND placed one in this period
    const returningCustomersResult = await db.execute(sql`
      SELECT COUNT(DISTINCT sub.customer_key)::int as returning_customers
      FROM (
        SELECT COALESCE(customer_id::text, guest_email) as customer_key
        FROM orders
        WHERE created_at >= ${startDate}::timestamp
          AND created_at < ${endDate}::timestamp
          AND status NOT IN ('cancelled', 'refunded')
      ) sub
      WHERE sub.customer_key IN (
        SELECT COALESCE(customer_id::text, guest_email)
        FROM orders
        WHERE created_at < ${startDate}::timestamp
          AND status NOT IN ('cancelled', 'refunded')
      )
    `)

    // Average CLV: total lifetime revenue / unique customers (all time)
    const clvResult = await db.execute(sql`
      SELECT
        COALESCE(AVG(customer_total), 0)::numeric as avg_clv,
        COUNT(*)::int as total_unique_customers
      FROM (
        SELECT
          COALESCE(customer_id::text, guest_email) as customer_key,
          SUM(total) as customer_total
        FROM orders
        WHERE status NOT IN ('cancelled', 'refunded')
        GROUP BY COALESCE(customer_id::text, guest_email)
      ) lifetime
    `)

    // Customer count over time (new customers per day in period)
    const customerTimeline = await db.execute(sql`
      SELECT
        first_order_date as date,
        COUNT(*)::int as new_customers
      FROM (
        SELECT
          COALESCE(customer_id::text, guest_email) as customer_key,
          DATE(MIN(created_at)) as first_order_date
        FROM orders
        WHERE status NOT IN ('cancelled', 'refunded')
        GROUP BY COALESCE(customer_id::text, guest_email)
        HAVING MIN(created_at) >= ${startDate}::timestamp
          AND MIN(created_at) < ${endDate}::timestamp
      ) first_orders
      GROUP BY first_order_date
      ORDER BY first_order_date
    `)

    // Top customers by revenue in period
    const topCustomers = await db.execute(sql`
      SELECT
        COALESCE(customer_id::text, guest_email) as customer_key,
        customer_id,
        guest_email,
        guest_name,
        COUNT(*)::int as order_count,
        COALESCE(SUM(total), 0)::numeric as total_revenue
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY COALESCE(customer_id::text, guest_email), customer_id, guest_email, guest_name
      ORDER BY total_revenue DESC
      LIMIT 10
    `)

    const newCustomers = parseInt((newCustomersResult.rows?.[0] || newCustomersResult[0])?.new_customers) || 0
    const returningCustomers = parseInt((returningCustomersResult.rows?.[0] || returningCustomersResult[0])?.returning_customers) || 0
    const clvRow = clvResult.rows?.[0] || clvResult[0] || {}
    const avgClv = parseFloat(clvRow.avg_clv) || 0
    const totalUniqueCustomers = parseInt(clvRow.total_unique_customers) || 0
    const timeline = (customerTimeline.rows || customerTimeline || []) as any[]
    const topCustomerRows = (topCustomers.rows || topCustomers || []) as any[]

    return NextResponse.json({
      period,
      startDate,
      endDate,
      summary: {
        newCustomers,
        returningCustomers,
        totalActiveInPeriod: newCustomers + returningCustomers,
        totalUniqueCustomersAllTime: totalUniqueCustomers,
        averageCLV: Math.round(avgClv * 100) / 100,
      },
      timeline: timeline.map((row: any) => ({
        date: row.date,
        newCustomers: parseInt(row.new_customers) || 0,
      })),
      topCustomers: topCustomerRows.map((row: any) => ({
        customerId: row.customer_id || null,
        guestEmail: row.guest_email || null,
        guestName: row.guest_name || null,
        orderCount: parseInt(row.order_count) || 0,
        totalRevenue: Math.round((parseFloat(row.total_revenue) || 0) * 100) / 100,
      })),
    })
  } catch (error: any) {
    console.error('[analytics/customers] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
