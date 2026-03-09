// Lib exports
export type {
  RFMSegment,
  CustomerMetrics,
  SegmentDistribution,
  InsightsDashboardData,
} from './lib/types'
export { SEGMENT_CONFIG, RFM_SEGMENT_RULES } from './lib/constants'
export { aggregateCustomerData } from './lib/data-aggregator'
export { calculateRFMScores, assignSegment } from './lib/rfm-calculator'
export { calculateSegmentDistribution, getSegmentTrend } from './lib/segment-engine'
export { calculateHistoricalCLV, calculatePredictedCLV, enrichWithCLV } from './lib/clv-calculator'
export { calculateChurnRisk, enrichWithChurnRisk } from './lib/churn-predictor'
export { saveCustomerMetrics } from './lib/metrics-writer'

// Component exports
export { InsightsDashboard } from './components/InsightsDashboard'
export { KPICards } from './components/KPICards'
export { SegmentDistribution as SegmentDistributionChart } from './components/SegmentDistribution'
export { ChurnRiskTable } from './components/ChurnRiskTable'
export { CLVChart } from './components/CLVChart'
export { RFMHeatmap } from './components/RFMHeatmap'
