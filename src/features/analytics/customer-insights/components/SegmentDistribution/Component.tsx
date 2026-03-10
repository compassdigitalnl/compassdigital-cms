'use client'

import { SEGMENT_CONFIG } from '../../lib/constants'
import type { SegmentDistributionProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
  marginBottom: '1.5rem',
}

export function SegmentDistribution({ segments }: SegmentDistributionProps) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Klantsegmenten</h3>
        <p style={{ padding: '2rem 0', textAlign: 'center', color: '#9ca3af' }}>Geen segmentdata beschikbaar</p>
      </div>
    )
  }

  const maxPercentage = Math.max(...segments.map((s) => s.percentage), 1)

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Klantsegmenten</h3>
      <div>
        {segments.map((seg) => {
          const config = SEGMENT_CONFIG[seg.segment]
          return (
            <div key={seg.segment} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <div style={{ width: '2rem', textAlign: 'center', fontSize: '1.125rem' }} title={config.description}>
                {config.icon}
              </div>
              <div style={{ width: '8rem', flexShrink: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{config.label}</div>
                <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{seg.count} klanten</div>
              </div>
              <div style={{ flex: 1, height: '1.5rem', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.5rem',
                    width: `${Math.max(2, (seg.percentage / maxPercentage) * 100)}%`,
                    backgroundColor: config.color,
                    transition: 'width 0.5s',
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                    {seg.percentage > 5 ? `${seg.percentage}%` : ''}
                  </span>
                </div>
              </div>
              <div style={{ width: '3rem', flexShrink: 0, textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>
                {seg.percentage}%
              </div>
              <div style={{ width: '7rem', flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{formatCurrency(seg.totalRevenue)}</div>
                <div style={{ fontSize: '0.625rem', color: '#9ca3af' }}>CLV: {formatCurrency(seg.avgClv)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
