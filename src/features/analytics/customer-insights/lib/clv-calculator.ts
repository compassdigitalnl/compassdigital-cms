import type { CustomerMetrics, RFMSegment } from './types'

/** Expected customer lifetime in years based on segment */
const SEGMENT_EXPECTED_YEARS: Record<RFMSegment, number> = {
  champions: 5,
  loyal: 3,
  potential: 2,
  new: 1.5,
  at_risk: 1,
  hibernating: 0.5,
  lost: 0,
}

/**
 * Historical CLV is simply total revenue to date.
 */
export function calculateHistoricalCLV(customer: CustomerMetrics): number {
  return Math.round(customer.totalRevenue * 100) / 100
}

/**
 * Predicted CLV based on:
 * avg_order_value x predicted_orders_per_year x expected_years
 *
 * predicted_orders_per_year = 365 / orderFrequencyDays (capped at reasonable bounds)
 * expected_years = based on RFM segment
 */
export function calculatePredictedCLV(customer: CustomerMetrics): number {
  if (customer.totalOrders === 0 || customer.avgOrderValue === 0) return 0

  // Calculate predicted orders per year
  let ordersPerYear: number
  if (customer.orderFrequencyDays > 0) {
    ordersPerYear = 365 / customer.orderFrequencyDays
    // Cap at realistic bounds: min 0.5 orders/year, max 365 orders/year
    ordersPerYear = Math.max(0.5, Math.min(365, ordersPerYear))
  } else {
    // Single order customer: assume 1 order per year
    ordersPerYear = 1
  }

  const expectedYears = SEGMENT_EXPECTED_YEARS[customer.rfmSegment] || 1

  const predicted = customer.avgOrderValue * ordersPerYear * expectedYears
  return Math.round(predicted * 100) / 100
}

/**
 * Enrich all customers with CLV calculations.
 */
export function enrichWithCLV(customers: CustomerMetrics[]): CustomerMetrics[] {
  return customers.map((customer) => ({
    ...customer,
    clvHistorical: calculateHistoricalCLV(customer),
    clvPredicted: calculatePredictedCLV(customer),
  }))
}
