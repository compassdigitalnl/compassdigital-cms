'use client'

import type { RFMHeatmapProps } from './types'

/**
 * 5x5 heatmap grid: Recency (rows, 5=top to 1=bottom) vs Frequency (columns, 1=left to 5=right).
 * Color intensity based on customer count in each cell.
 */
export function RFMHeatmap({ customers }: RFMHeatmapProps) {
  // Build 5x5 grid [recency][frequency]
  const grid: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0))

  for (const c of customers) {
    const r = Math.max(1, Math.min(5, c.recencyScore))
    const f = Math.max(1, Math.min(5, c.frequencyScore))
    grid[r - 1][f - 1]++
  }

  const maxCount = Math.max(...grid.flat(), 1)

  function getCellColor(count: number): string {
    if (count === 0) return 'bg-gray-50'
    const intensity = count / maxCount
    if (intensity > 0.75) return 'bg-blue-600 text-white'
    if (intensity > 0.5) return 'bg-blue-400 text-white'
    if (intensity > 0.25) return 'bg-blue-200 text-gray-800'
    return 'bg-blue-100 text-gray-700'
  }

  // Rows go from R=5 (top) to R=1 (bottom)
  const rowLabels = [5, 4, 3, 2, 1]
  const colLabels = [1, 2, 3, 4, 5]

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">RFM Heatmap</h3>
      <p className="mb-3 text-xs text-gray-500">
        Recency (rijen, hoog=recent) vs Frequentie (kolommen, hoog=vaak)
      </p>
      <div className="inline-block">
        <div className="flex items-end">
          {/* Y-axis label */}
          <div className="mr-2 flex flex-col items-center justify-center">
            <span className="mb-1 -rotate-90 whitespace-nowrap text-xs font-medium text-gray-500">
              Recency
            </span>
          </div>
          <div>
            {/* Column headers */}
            <div className="ml-8 flex">
              {colLabels.map((f) => (
                <div key={f} className="flex h-6 w-14 items-center justify-center text-xs font-medium text-gray-500">
                  F={f}
                </div>
              ))}
            </div>
            {/* Grid rows */}
            {rowLabels.map((r) => (
              <div key={r} className="flex items-center">
                <div className="flex w-8 items-center justify-center text-xs font-medium text-gray-500">
                  R={r}
                </div>
                {colLabels.map((f) => {
                  const count = grid[r - 1][f - 1]
                  return (
                    <div
                      key={`${r}-${f}`}
                      className={`m-0.5 flex h-12 w-14 items-center justify-center rounded text-sm font-medium ${getCellColor(count)}`}
                      title={`R=${r}, F=${f}: ${count} klanten`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  )
                })}
              </div>
            ))}
            {/* X-axis label */}
            <div className="ml-8 mt-1 text-center text-xs font-medium text-gray-500">
              Frequentie
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
