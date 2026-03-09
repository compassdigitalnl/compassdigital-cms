import { sql } from 'drizzle-orm'
import type { CustomerMetrics } from './types'

/**
 * Aggregate order data per customer from the orders table.
 * The orders collection uses `customer` as relationship to users,
 * which maps to `customer_id` in Postgres (Payload convention).
 */
export async function aggregateCustomerData(drizzle: any): Promise<CustomerMetrics[]> {
  const result = await drizzle.execute(sql`
    SELECT
      o.customer_id as user_id,
      u.email as email,
      COALESCE(u.name, '') as name,
      COUNT(*)::int as total_orders,
      COALESCE(SUM(o.total), 0)::numeric as total_revenue,
      COALESCE(AVG(o.total), 0)::numeric as avg_order_value,
      MIN(o.created_at) as first_order_at,
      MAX(o.created_at) as last_order_at,
      GREATEST(0, EXTRACT(EPOCH FROM (NOW() - MAX(o.created_at))) / 86400)::int as days_since_last_order
    FROM orders o
    LEFT JOIN users u ON u.id = o.customer_id
    WHERE o.status NOT IN ('cancelled', 'refunded')
    GROUP BY o.customer_id, u.email, u.name
    HAVING o.customer_id IS NOT NULL
  `)

  const rows = result.rows || result || []

  return (rows as any[]).map((row: any) => {
    const totalOrders = parseInt(row.total_orders) || 0
    const firstOrder = row.first_order_at ? new Date(row.first_order_at).getTime() : null
    const lastOrder = row.last_order_at ? new Date(row.last_order_at).getTime() : null

    // Calculate average days between orders
    let orderFrequencyDays = 0
    if (firstOrder && lastOrder && totalOrders > 1) {
      const spanDays = (lastOrder - firstOrder) / (1000 * 60 * 60 * 24)
      orderFrequencyDays = spanDays / (totalOrders - 1)
    }

    return {
      userId: parseInt(row.user_id),
      email: row.email || undefined,
      name: row.name || undefined,
      totalOrders,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      avgOrderValue: parseFloat(row.avg_order_value) || 0,
      firstOrderAt: row.first_order_at ? new Date(row.first_order_at).toISOString() : null,
      lastOrderAt: row.last_order_at ? new Date(row.last_order_at).toISOString() : null,
      daysSinceLastOrder: parseInt(row.days_since_last_order) || 0,
      orderFrequencyDays: Math.round(orderFrequencyDays * 100) / 100,
      // Scores will be filled in by rfm-calculator
      recencyScore: 0,
      frequencyScore: 0,
      monetaryScore: 0,
      rfmSegment: 'new' as const,
      clvHistorical: 0,
      clvPredicted: 0,
      churnRisk: 0,
      churnLabel: 'low' as const,
    }
  })
}
