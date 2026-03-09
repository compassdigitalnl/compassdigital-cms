import type { CustomerMetrics } from './types'

/**
 * Calculate churn risk score (0-1) for a single customer.
 *
 * Factors:
 * 1. Recency factor: days since last order relative to their order frequency
 *    If they usually order every 30 days but haven't in 90, that's concerning.
 * 2. Frequency factor: lower frequency = higher risk (inverted from RFM score)
 * 3. Single-order risk: customers with only 1 order are inherently higher risk
 *
 * Labels:
 * - < 0.25 = low
 * - < 0.50 = medium
 * - < 0.75 = high
 * - >= 0.75 = critical
 */
export function calculateChurnRisk(
  customer: CustomerMetrics
): { risk: number; label: 'low' | 'medium' | 'high' | 'critical' } {
  // If no orders at all, max risk
  if (customer.totalOrders === 0) {
    return { risk: 1, label: 'critical' }
  }

  let riskScore = 0

  // 1. Recency factor (weight: 50%)
  // Compare days since last order to their typical frequency
  if (customer.orderFrequencyDays > 0) {
    const overdueRatio = customer.daysSinceLastOrder / customer.orderFrequencyDays
    // overdueRatio = 1 means right on schedule, >2 means significantly overdue
    const recencyRisk = Math.min(1, Math.max(0, (overdueRatio - 0.5) / 3))
    riskScore += recencyRisk * 0.5
  } else {
    // Single-order customers: base on absolute days since order
    // 0-30 days = low, 30-90 = medium, 90-180 = high, 180+ = critical
    const absRecencyRisk = Math.min(1, customer.daysSinceLastOrder / 180)
    riskScore += absRecencyRisk * 0.5
  }

  // 2. Frequency factor (weight: 30%)
  // Fewer orders = higher risk. Use inverted RFM frequency score.
  const frequencyRisk = Math.max(0, (6 - customer.frequencyScore) / 5)
  riskScore += frequencyRisk * 0.3

  // 3. Single order penalty (weight: 20%)
  // Customers with only 1 order are at higher risk of never returning
  if (customer.totalOrders === 1) {
    riskScore += 0.2
  } else if (customer.totalOrders === 2) {
    riskScore += 0.1
  }
  // More orders = no penalty

  // Clamp to 0-1
  riskScore = Math.min(1, Math.max(0, riskScore))
  riskScore = Math.round(riskScore * 100) / 100

  // Assign label
  let label: 'low' | 'medium' | 'high' | 'critical'
  if (riskScore < 0.25) label = 'low'
  else if (riskScore < 0.5) label = 'medium'
  else if (riskScore < 0.75) label = 'high'
  else label = 'critical'

  return { risk: riskScore, label }
}

/**
 * Enrich all customers with churn risk scores.
 */
export function enrichWithChurnRisk(customers: CustomerMetrics[]): CustomerMetrics[] {
  return customers.map((customer) => {
    const { risk, label } = calculateChurnRisk(customer)
    return {
      ...customer,
      churnRisk: risk,
      churnLabel: label,
    }
  })
}
