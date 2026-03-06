'use client'

import React from 'react'
import type { PricingFeatureTableProps, FeatureValue } from './types'

function CellValue({ val, isHighlightedCol }: { val: FeatureValue; isHighlightedCol: boolean }) {
  const hiClass = isHighlightedCol ? 'bg-[var(--color-primary-glow)]' : ''

  if (val.type === 'check') {
    return (
      <td className={`p-3 text-center text-sm font-bold text-[var(--color-success,#00C853)] ${hiClass}`}>
        ✓
      </td>
    )
  }
  if (val.type === 'dash') {
    return (
      <td className={`p-3 text-center text-sm text-[var(--color-border,#E8ECF1)] ${hiClass}`}>
        —
      </td>
    )
  }
  return (
    <td className={`p-3 text-center text-sm font-semibold text-[var(--color-text-primary)] ${hiClass}`}>
      {val.highlighted ? <strong>{val.value}</strong> : val.value}
    </td>
  )
}

export const PricingFeatureTable: React.FC<PricingFeatureTableProps> = ({
  title = 'Vergelijk alle functies',
  subtitle,
  planNames,
  highlightedPlanIndex,
  categories,
  className = '',
}) => {
  return (
    <div className={className}>
      <div className="mb-6 text-center">
        <h2 className="font-heading text-[26px] font-extrabold text-[var(--color-text-primary)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded-2xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className="w-[260px] border-b-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-grey-light,#F1F4F8)] p-3.5 text-left font-heading text-[13px] font-extrabold" />
              {planNames.map((name, i) => (
                <th
                  key={i}
                  className={`border-b-2 border-[var(--color-border,#E8ECF1)] p-3.5 text-center font-heading text-[13px] font-extrabold ${
                    i === highlightedPlanIndex
                      ? 'bg-[var(--color-primary-glow)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-grey-light,#F1F4F8)]'
                  }`}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, ci) => (
              <React.Fragment key={ci}>
                <tr>
                  <td
                    colSpan={planNames.length + 1}
                    className="bg-[var(--color-grey-light,#F1F4F8)] px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]"
                  >
                    {cat.name}
                  </td>
                </tr>
                {cat.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[var(--color-border,#E8ECF1)] last:border-b-0">
                    <td className="p-3 text-left text-[13px] font-semibold text-[var(--color-text-primary)]">
                      {row.label}
                    </td>
                    {row.values.map((val, vi) => (
                      <CellValue key={vi} val={val} isHighlightedCol={vi === highlightedPlanIndex} />
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
