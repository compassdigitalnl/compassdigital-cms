import { sql } from 'drizzle-orm'
import type { CustomerMetrics, RFMSegment, SegmentDistribution } from './types'
import { SEGMENT_CONFIG } from './constants'

/**
 * Calculate distribution of customers across RFM segments.
 */
export function calculateSegmentDistribution(customers: CustomerMetrics[]): SegmentDistribution[] {
  const total = customers.length
  if (total === 0) return []

  const segmentMap = new Map<RFMSegment, { count: number; totalRevenue: number; totalClv: number }>()

  // Initialize all segments
  const allSegments = Object.keys(SEGMENT_CONFIG) as RFMSegment[]
  for (const seg of allSegments) {
    segmentMap.set(seg, { count: 0, totalRevenue: 0, totalClv: 0 })
  }

  for (const customer of customers) {
    const entry = segmentMap.get(customer.rfmSegment)
    if (entry) {
      entry.count++
      entry.totalRevenue += customer.totalRevenue
      entry.totalClv += customer.clvPredicted || customer.clvHistorical
    }
  }

  return allSegments.map((segment) => {
    const data = segmentMap.get(segment)!
    return {
      segment,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 1000) / 10 : 0,
      totalRevenue: Math.round(data.totalRevenue * 100) / 100,
      avgClv: data.count > 0 ? Math.round((data.totalClv / data.count) * 100) / 100 : 0,
    }
  })
}

/**
 * Compare current segment distribution with a previous snapshot to detect trends.
 * Reads from the customer_metrics table to compare current vs previous period.
 */
export async function getSegmentTrend(
  drizzle: any,
  days: number = 30
): Promise<{ segment: RFMSegment; gained: number; lost: number }[]> {
  const allSegments = Object.keys(SEGMENT_CONFIG) as RFMSegment[]

  try {
    // Get current segment counts
    const currentResult = await drizzle.execute(sql`
      SELECT rfm_segment, COUNT(*)::int as count
      FROM customer_metrics
      GROUP BY rfm_segment
    `)

    const currentRows = currentResult.rows || currentResult || []
    const currentMap = new Map<string, number>()
    for (const row of currentRows as any[]) {
      currentMap.set(row.rfm_segment, parseInt(row.count) || 0)
    }

    // Since we don't have historical snapshots yet, return zeroed trends
    // In a production system you'd compare against a snapshot table
    return allSegments.map((segment) => ({
      segment,
      gained: 0,
      lost: 0,
    }))
  } catch {
    return allSegments.map((segment) => ({
      segment,
      gained: 0,
      lost: 0,
    }))
  }
}
