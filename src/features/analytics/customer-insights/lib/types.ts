export type RFMSegment = 'champions' | 'loyal' | 'potential' | 'new' | 'at_risk' | 'hibernating' | 'lost'

export interface CustomerMetrics {
  userId: number
  email?: string
  name?: string
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  firstOrderAt: string | null
  lastOrderAt: string | null
  daysSinceLastOrder: number
  orderFrequencyDays: number
  recencyScore: number
  frequencyScore: number
  monetaryScore: number
  rfmSegment: RFMSegment
  clvHistorical: number
  clvPredicted: number
  churnRisk: number
  churnLabel: 'low' | 'medium' | 'high' | 'critical'
}

export interface SegmentDistribution {
  segment: RFMSegment
  count: number
  percentage: number
  totalRevenue: number
  avgClv: number
}

export interface InsightsDashboardData {
  totalCustomers: number
  activeCustomers: number
  avgClv: number
  avgOrderValue: number
  churnRate: number
  segments: SegmentDistribution[]
  topChurnRisk: CustomerMetrics[]
  topClv: CustomerMetrics[]
  recentChanges: { segment: RFMSegment; gained: number; lost: number }[]
}
