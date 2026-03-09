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

    // Total registered users
    const usersResult = await db.execute(sql`
      SELECT COUNT(*)::int as total_users
      FROM users
      WHERE created_at < ${endDate}::timestamp
    `)

    // Users who registered in this period
    const newUsersResult = await db.execute(sql`
      SELECT COUNT(*)::int as new_users
      FROM users
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
    `)

    // All orders in period (= checkout starts)
    const allOrdersResult = await db.execute(sql`
      SELECT COUNT(*)::int as total_orders
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
    `)

    // Completed orders (paid, processing, shipped, delivered)
    const completedOrdersResult = await db.execute(sql`
      SELECT COUNT(*)::int as completed_orders
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status IN ('paid', 'processing', 'shipped', 'delivered')
    `)

    // Unique customers with orders in period
    const uniqueCustomersResult = await db.execute(sql`
      SELECT COUNT(DISTINCT COALESCE(customer_id::text, guest_email))::int as unique_customers
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status NOT IN ('cancelled', 'refunded')
    `)

    // Cancelled/refunded orders
    const cancelledResult = await db.execute(sql`
      SELECT COUNT(*)::int as cancelled_orders
      FROM orders
      WHERE created_at >= ${startDate}::timestamp
        AND created_at < ${endDate}::timestamp
        AND status IN ('cancelled', 'refunded')
    `)

    const totalUsers = parseInt((usersResult.rows?.[0] || usersResult[0])?.total_users) || 0
    const newUsers = parseInt((newUsersResult.rows?.[0] || newUsersResult[0])?.new_users) || 0
    const totalOrders = parseInt((allOrdersResult.rows?.[0] || allOrdersResult[0])?.total_orders) || 0
    const completedOrders = parseInt((completedOrdersResult.rows?.[0] || completedOrdersResult[0])?.completed_orders) || 0
    const uniqueCustomers = parseInt((uniqueCustomersResult.rows?.[0] || uniqueCustomersResult[0])?.unique_customers) || 0
    const cancelledOrders = parseInt((cancelledResult.rows?.[0] || cancelledResult[0])?.cancelled_orders) || 0

    const checkoutCompletionRate = totalOrders > 0
      ? Math.round((completedOrders / totalOrders) * 1000) / 10
      : 0

    const cancellationRate = totalOrders > 0
      ? Math.round((cancelledOrders / totalOrders) * 1000) / 10
      : 0

    return NextResponse.json({
      period,
      startDate,
      endDate,
      funnel: {
        totalRegisteredUsers: totalUsers,
        newUsersInPeriod: newUsers,
        totalOrders,
        completedOrders,
        cancelledOrders,
        uniqueCustomers,
        checkoutCompletionRate,
        cancellationRate,
      },
    })
  } catch (error: any) {
    console.error('[analytics/funnels] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
