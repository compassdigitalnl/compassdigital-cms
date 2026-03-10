'use client'

import type { RFMHeatmapProps } from './types'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
}

function getCellStyle(count: number, maxCount: number): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '3rem',
    height: '2.5rem',
    margin: '0.125rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
  }

  if (count === 0) return { ...base, background: '#f9fafb', color: '#d1d5db' }

  const intensity = count / maxCount
  if (intensity > 0.75) return { ...base, background: '#1d4ed8', color: '#fff' }
  if (intensity > 0.5) return { ...base, background: '#3b82f6', color: '#fff' }
  if (intensity > 0.25) return { ...base, background: '#93c5fd', color: '#fff' }
  return { ...base, background: '#dbeafe', color: '#1e40af' }
}

export function RFMHeatmap({ customers }: RFMHeatmapProps) {
  const grid: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0))

  for (const c of customers) {
    const r = Math.max(1, Math.min(5, c.recencyScore))
    const f = Math.max(1, Math.min(5, c.frequencyScore))
    grid[r - 1][f - 1]++
  }

  const maxCount = Math.max(...grid.flat(), 1)
  const rowLabels = [5, 4, 3, 2, 1]
  const colLabels = [1, 2, 3, 4, 5]

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.75rem' }}>RFM Heatmap</h3>
      <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
        Recency (rijen, hoog=recent) vs Frequentie (kolommen, hoog=vaak)
      </p>
      <div style={{ display: 'inline-block' }}>
        {/* Column headers */}
        <div style={{ display: 'flex', marginLeft: '2rem', marginBottom: '0.25rem' }}>
          {colLabels.map((f) => (
            <div key={f} style={{ width: '3.25rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 500, color: '#9ca3af' }}>
              F={f}
            </div>
          ))}
        </div>
        {/* Grid with Y-axis */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '0.6875rem', fontWeight: 500, color: '#9ca3af', marginRight: '0.5rem' }}>
            Recency
          </div>
          <div>
            {rowLabels.map((r) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '2rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 500, color: '#9ca3af' }}>
                  R={r}
                </div>
                {colLabels.map((f) => {
                  const count = grid[r - 1][f - 1]
                  return (
                    <div
                      key={`${r}-${f}`}
                      style={getCellStyle(count, maxCount)}
                      title={`R=${r}, F=${f}: ${count} klanten`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  )
                })}
              </div>
            ))}
            {/* X-axis label */}
            <div style={{ marginLeft: '2rem', marginTop: '0.25rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 500, color: '#9ca3af' }}>
              Frequentie
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
