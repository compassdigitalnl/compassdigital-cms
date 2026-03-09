import type { CustomerMetrics, RFMSegment } from './types'
import { RFM_SEGMENT_RULES } from './constants'

/**
 * Assign a quintile score (1-5) based on sorted values.
 * For recency: lower days = better = higher score (inverted).
 * For frequency & monetary: higher = better = higher score.
 */
function assignQuintileScores(values: number[], invert: boolean = false): number[] {
  if (values.length === 0) return []

  // Create indexed pairs for sorting
  const indexed = values.map((v, i) => ({ value: v, index: i }))
  indexed.sort((a, b) => a.value - b.value)

  const scores = new Array(values.length).fill(1)
  const n = indexed.length
  const quintileSize = Math.max(1, Math.ceil(n / 5))

  indexed.forEach((item, rank) => {
    let score = Math.min(5, Math.floor(rank / quintileSize) + 1)
    if (invert) {
      score = 6 - score // Invert: rank 1 (lowest days) gets score 5
    }
    scores[item.index] = score
  })

  return scores
}

/**
 * Map RFM scores to a segment using the segment rules.
 * Rules are checked in priority order (most specific first).
 */
export function assignSegment(r: number, f: number, m: number): RFMSegment {
  const segmentOrder: RFMSegment[] = ['champions', 'loyal', 'potential', 'new', 'at_risk', 'hibernating', 'lost']

  for (const segment of segmentOrder) {
    const rule = RFM_SEGMENT_RULES[segment]
    if (
      r >= rule.r[0] && r <= rule.r[1] &&
      f >= rule.f[0] && f <= rule.f[1] &&
      m >= rule.m[0] && m <= rule.m[1]
    ) {
      return segment
    }
  }

  // Fallback
  return 'new'
}

/**
 * Calculate RFM scores for all customers using percentile-based quintiles.
 */
export function calculateRFMScores(customers: CustomerMetrics[]): CustomerMetrics[] {
  if (customers.length === 0) return []

  const recencyValues = customers.map((c) => c.daysSinceLastOrder)
  const frequencyValues = customers.map((c) => c.totalOrders)
  const monetaryValues = customers.map((c) => c.totalRevenue)

  // Recency is inverted: fewer days since last order = higher score
  const rScores = assignQuintileScores(recencyValues, true)
  const fScores = assignQuintileScores(frequencyValues, false)
  const mScores = assignQuintileScores(monetaryValues, false)

  return customers.map((customer, i) => {
    const r = rScores[i]
    const f = fScores[i]
    const m = mScores[i]

    return {
      ...customer,
      recencyScore: r,
      frequencyScore: f,
      monetaryScore: m,
      rfmSegment: assignSegment(r, f, m),
    }
  })
}
