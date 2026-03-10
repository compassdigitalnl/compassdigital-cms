import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import type { InsightsDashboardData, CustomerMetrics, RFMSegment } from '@/features/analytics/customer-insights/lib/types'
import { SEGMENT_CONFIG } from '@/features/analytics/customer-insights/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || !('roles' in user) || !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = (payload.db as any).drizzle

    // Fetch all customer metrics
    const metricsResult = await db.execute(sql`
      SELECT
        cm.*,
        u.email,
        u.name
      FROM customer_metrics cm
      LEFT JOIN users u ON u.id = cm.user_id
      ORDER BY cm.total_revenue DESC
    `)

    const rows = (metricsResult.rows || metricsResult || []) as any[]

    const customers: CustomerMetrics[] = rows.map((row: any) => ({
      userId: parseInt(row.user_id),
      email: row.email || undefined,
      name: row.name || undefined,
      totalOrders: parseInt(row.total_orders) || 0,
      totalRevenue: parseFloat(row.total_revenue) || 0,
      avgOrderValue: parseFloat(row.avg_order_value) || 0,
      firstOrderAt: row.first_order_at ? new Date(row.first_order_at).toISOString() : null,
      lastOrderAt: row.last_order_at ? new Date(row.last_order_at).toISOString() : null,
      daysSinceLastOrder: parseInt(row.days_since_last_order) || 0,
      orderFrequencyDays: parseFloat(row.order_frequency_days) || 0,
      recencyScore: parseInt(row.recency_score) || 0,
      frequencyScore: parseInt(row.frequency_score) || 0,
      monetaryScore: parseInt(row.monetary_score) || 0,
      rfmSegment: (row.rfm_segment || 'new') as RFMSegment,
      clvHistorical: parseFloat(row.clv_historical) || 0,
      clvPredicted: parseFloat(row.clv_predicted) || 0,
      churnRisk: parseFloat(row.churn_risk) || 0,
      churnLabel: row.churn_label || 'low',
    }))

    const totalCustomers = customers.length
    const activeCustomers = customers.filter((c) => c.daysSinceLastOrder <= 90).length
    const avgClv = totalCustomers > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.clvPredicted, 0) / totalCustomers * 100) / 100
      : 0
    const avgOrderValue = totalCustomers > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.avgOrderValue, 0) / totalCustomers * 100) / 100
      : 0
    const highChurnCount = customers.filter((c) => c.churnRisk >= 0.5).length
    const churnRate = totalCustomers > 0
      ? Math.round((highChurnCount / totalCustomers) * 1000) / 10
      : 0

    // Segment distribution
    const segmentMap = new Map<RFMSegment, { count: number; totalRevenue: number; totalClv: number }>()
    const allSegments = Object.keys(SEGMENT_CONFIG) as RFMSegment[]
    for (const seg of allSegments) {
      segmentMap.set(seg, { count: 0, totalRevenue: 0, totalClv: 0 })
    }
    for (const c of customers) {
      const entry = segmentMap.get(c.rfmSegment)
      if (entry) {
        entry.count++
        entry.totalRevenue += c.totalRevenue
        entry.totalClv += c.clvPredicted
      }
    }
    const segments = allSegments.map((segment) => {
      const data = segmentMap.get(segment)!
      return {
        segment,
        count: data.count,
        percentage: totalCustomers > 0 ? Math.round((data.count / totalCustomers) * 1000) / 10 : 0,
        totalRevenue: Math.round(data.totalRevenue * 100) / 100,
        avgClv: data.count > 0 ? Math.round((data.totalClv / data.count) * 100) / 100 : 0,
      }
    })

    // Top churn risk (top 20)
    const topChurnRisk = [...customers]
      .sort((a, b) => b.churnRisk - a.churnRisk)
      .slice(0, 20)

    // Top CLV (top 10)
    const topClv = [...customers]
      .sort((a, b) => b.clvPredicted - a.clvPredicted)
      .slice(0, 10)

    const data: InsightsDashboardData = {
      totalCustomers,
      activeCustomers,
      avgClv,
      avgOrderValue,
      churnRate,
      segments,
      topChurnRisk,
      topClv,
      recentChanges: allSegments.map((segment) => ({ segment, gained: 0, lost: 0 })),
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[analytics/customer-insights] Error:', error)
    return NextResponse.json({ error: message || 'Internal server error' }, { status: 500 })
  }
}
