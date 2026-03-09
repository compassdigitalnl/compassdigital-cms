'use client'

import { Gutter } from '@payloadcms/ui'
import { InsightsDashboard } from '../../customer-insights/components/InsightsDashboard'

export function InsightsView() {
  return (
    <Gutter>
      <h1 style={{ marginBottom: '0.5rem' }}>Klantinzichten</h1>
      <p style={{ marginBottom: '1.5rem', opacity: 0.6 }}>RFM-analyse, segmentatie, CLV en churn-predictie</p>
      <InsightsDashboard />
    </Gutter>
  )
}
