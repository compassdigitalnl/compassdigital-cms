'use client'
import React from 'react'
import type { ComparisonTableBlock } from '@/payload-types'

export const ComparisonTableComponent: React.FC<ComparisonTableBlock> = ({
  caption,
  headers,
  rows,
}) => {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return null
  }

  return (
    <div style={{ margin: '24px 0' }}>
      {caption && (
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '17px',
            fontWeight: 700,
            color: '#0A1628',
            marginBottom: '12px',
          }}
        >
          {caption}
        </h3>
      )}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #E8ECF1',
        }}
      >
        <thead>
          <tr>
            {/* First header is for row labels */}
            <th
              style={{
                background: '#0A1628',
                color: 'white',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'left',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {/* Empty or could be "Eigenschap" */}
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  background: '#0A1628',
                  color: 'white',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
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
              style={{
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                const cells = e.currentTarget.querySelectorAll('td')
                cells.forEach((cell) => {
                  ;(cell as HTMLElement).style.background = 'rgba(0, 137, 123, 0.12)'
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
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#0A1628',
                  borderBottom:
                    rowIndex === rows.length - 1 ? 'none' : '1px solid #E8ECF1',
                  background: 'white',
                  fontWeight: 600,
                  transition: 'background 0.15s',
                }}
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
                      style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: isCheck ? '#00C853' : isCross ? '#FF6B6B' : '#0A1628',
                        borderBottom:
                          rowIndex === rows.length - 1 ? 'none' : '1px solid #E8ECF1',
                        background: 'white',
                        fontWeight: isCheck || isCross ? 700 : 400,
                        transition: 'background 0.15s',
                      }}
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
