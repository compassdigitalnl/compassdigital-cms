'use client'

import { Gutter } from '@payloadcms/ui'
import { RevenueDashboard } from '../RevenueDashboard'

export function AnalyticsView() {
  return (
    <Gutter>
      <h1 style={{ marginBottom: '1.5rem' }}>Analytics Dashboard</h1>
      <RevenueDashboard />
    </Gutter>
  )
}
