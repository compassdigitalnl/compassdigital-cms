import React from 'react'
import { Check, X } from 'lucide-react'

/**
 * B15 - Comparison Table Block Component
 *
 * Feature comparison table for plans/products with responsive layout.
 *
 * FEATURES:
 * - Desktop: Grid table (200px feature label + equal width columns)
 * - Mobile: Stacked cards per column
 * - Featured column highlight (teal background)
 * - 3 value types: Check mark (✓), X mark (✗), or custom text
 * - 2-4 comparison columns supported
 *
 * @see src/branches/shared/blocks/Comparison/config.ts
 * @see docs/refactoring/sprint-6/b15-comparison.html
 */

interface ComparisonValue {
  type: 'check' | 'x' | 'text'
  text?: string
  id?: string
}

interface ComparisonColumn {
  name: string
  price: string
  featured: boolean
  id?: string
}

interface ComparisonRow {
  feature: string
  values: ComparisonValue[]
  id?: string
}

interface ComparisonBlockProps {
  title?: string
  description?: string
  columns?: ComparisonColumn[]
  rows?: ComparisonRow[]
}

// Cell renderer for different value types
const ComparisonCell: React.FC<{ value: ComparisonValue }> = ({ value }) => {
  switch (value.type) {
    case 'check':
      return <Check className="w-5 h-5 text-green" />
    case 'x':
      return <X className="w-5 h-5 text-grey-mid" />
    case 'text':
      return <span className="text-sm text-navy font-medium">{value.text || '-'}</span>
    default:
      return null
  }
}

export const ComparisonBlockComponent: React.FC<ComparisonBlockProps> = ({
  title,
  description,
  columns = [],
  rows = [],
}) => {
  if (columns.length === 0 || rows.length === 0) {
    return null
  }

  // Calculate grid template columns: fixed 200px for feature labels + equal width for plan columns
  const gridCols = `200px repeat(${columns.length}, 1fr)`

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base text-grey-dark max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Desktop Comparison Table (hidden on mobile) */}
        <div className="hidden lg:block max-w-5xl mx-auto bg-white border border-grey rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row */}
          <div
            className="grid bg-grey-light border-b border-grey"
            style={{ gridTemplateColumns: gridCols }}
          >
            {/* Empty cell for feature column */}
            <div className="bg-white"></div>

            {/* Plan columns */}
            {columns.map((column, index) => (
              <div
                key={column.id || index}
                className={`p-5 text-center border-l border-grey ${
                  column.featured ? 'bg-teal-glow' : ''
                }`}
              >
                <div
                  className={`font-bold text-base mb-1 ${
                    column.featured ? 'text-teal' : 'text-navy'
                  }`}
                >
                  {column.name}
                </div>
                <div className="text-sm text-grey-mid">
                  {column.price}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {rows.map((row, rowIndex) => (
            <div
              key={row.id || rowIndex}
              className="grid border-b last:border-b-0 border-grey hover:bg-grey-light/30 transition-colors"
              style={{ gridTemplateColumns: gridCols }}
            >
              {/* Feature Label */}
              <div className="bg-grey-light px-4 py-4 flex items-center font-semibold text-sm text-navy border-r border-grey">
                {row.feature}
              </div>

              {/* Values */}
              {row.values.map((value, valueIndex) => {
                const isFeatured = columns[valueIndex]?.featured
                return (
                  <div
                    key={value.id || valueIndex}
                    className={`px-4 py-4 flex items-center justify-center border-l border-grey ${
                      isFeatured ? 'bg-teal-glow' : ''
                    }`}
                  >
                    <ComparisonCell value={value} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Mobile View: Stacked Cards */}
        <div className="lg:hidden space-y-4">
          {columns.map((column, colIndex) => (
            <div
              key={column.id || colIndex}
              className={`bg-white border rounded-xl overflow-hidden shadow-sm ${
                column.featured ? 'border-teal ring-2 ring-teal/20' : 'border-grey'
              }`}
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-grey ${column.featured ? 'bg-teal-glow' : 'bg-grey-light'}`}>
                <div className={`font-bold text-lg ${column.featured ? 'text-teal' : 'text-navy'}`}>
                  {column.name}
                </div>
                <div className="text-sm text-grey-mid">{column.price}</div>
              </div>

              {/* Features */}
              <div className="divide-y divide-grey">
                {rows.map((row, rowIndex) => (
                  <div key={row.id || rowIndex} className="flex items-center justify-between p-4">
                    <span className="font-medium text-sm text-navy">{row.feature}</span>
                    <ComparisonCell value={row.values[colIndex]} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
