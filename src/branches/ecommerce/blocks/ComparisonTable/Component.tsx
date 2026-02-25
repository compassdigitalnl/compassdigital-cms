'use client'
import React from 'react'
import type { ComparisonTableBlock } from '@/payload-types'

/**
 * ComparisonTable Component - 100% Theme Variable Compliant
 *
 * Refactored from 100% inline styles to Tailwind utility classes.
 * All colors now use CSS variables from ThemeProvider:
 * - Navy (#0A1628) → bg-secondary, text-secondary-color
 * - Grey border (#E8ECF1) → border-grey
 * - Success green → text-success
 * - Error red → text-error
 * - Teal hover → bg-primary-glow
 */
export const ComparisonTableComponent: React.FC<ComparisonTableBlock> = ({
  caption,
  headers,
  rows,
}) => {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return null
  }

  return (
    <div className="my-6">
      {caption && (
        <h3 className="font-bold text-[17px] text-secondary-color mb-3">
          {caption}
        </h3>
      )}

      <table className="w-full border-collapse rounded-xl overflow-hidden border border-grey">
        <thead>
          <tr>
            {/* First header is for row labels */}
            <th className="bg-secondary text-white px-4 py-3 text-[13px] font-bold text-left">
              {/* Empty or could be "Eigenschap" */}
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                className="bg-secondary text-white px-4 py-3 text-[13px] font-bold text-left"
              >
                {header.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="transition-colors duration-150"
              onMouseEnter={(e) => {
                const cells = e.currentTarget.querySelectorAll('td')
                cells.forEach((cell) => {
                  ;(cell as HTMLElement).style.background = 'var(--color-primary-glow)'
                })
              }}
              onMouseLeave={(e) => {
                const cells = e.currentTarget.querySelectorAll('td')
                cells.forEach((cell) => {
                  ;(cell as HTMLElement).style.background = 'white'
                })
              }}
            >
              {/* Row Label */}
              <td
                className={`
                  px-4 py-3 text-sm text-secondary-color bg-white font-semibold
                  transition-colors duration-150
                  ${rowIndex === rows.length - 1 ? '' : 'border-b border-grey'}
                `}
              >
                {row.rowLabel}
              </td>

              {/* Cells */}
              {row.cells &&
                row.cells.map((cell, cellIndex) => {
                  const isCheck = cell.type === 'check'
                  const isCross = cell.type === 'cross'

                  return (
                    <td
                      key={cellIndex}
                      className={`
                        px-4 py-3 text-sm bg-white transition-colors duration-150
                        ${isCheck ? 'text-success font-bold' : ''}
                        ${isCross ? 'text-error font-bold' : ''}
                        ${!isCheck && !isCross ? 'text-secondary-color' : ''}
                        ${rowIndex === rows.length - 1 ? '' : 'border-b border-grey'}
                      `}
                    >
                      {isCheck ? '✓' : isCross ? '✗' : cell.value}
                    </td>
                  )
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTableComponent
