'use client'

import React from 'react'
import { Edit2, FileText, Type, Palette, Image as ImageIcon } from 'lucide-react'
import type { PersonalizationSummaryCardProps } from '@/branches/ecommerce/lib/product-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

/**
 * PP06: PersonalizationSummaryCard
 *
 * Summary of all personalization choices with pricing breakdown
 * Features:
 * - List all personalization selections
 * - Shows field name, value, and price modifier
 * - Edit buttons for each field
 * - Total personalization cost
 * - Icon indicators per field type
 * - Responsive layout
 */

export const PersonalizationSummaryCard: React.FC<PersonalizationSummaryCardProps> = ({
  personalization,
  options,
  onEdit,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  // Calculate total personalization cost
  const totalCost = options.reduce((sum, option) => {
    const hasValue = personalization[option.fieldName]?.value
    if (hasValue && option.priceModifier) {
      return sum + option.priceModifier
    }
    return sum
  }, 0)

  // Get icon for field type
  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
        return <Type className="w-4 h-4" strokeWidth={2.5} />
      case 'font':
        return <FileText className="w-4 h-4" strokeWidth={2.5} />
      case 'color':
        return <Palette className="w-4 h-4" strokeWidth={2.5} />
      case 'image':
        return <ImageIcon className="w-4 h-4" strokeWidth={2.5} />
      default:
        return <FileText className="w-4 h-4" strokeWidth={2.5} />
    }
  }

  // Format value display
  const formatValue = (value: any, fieldType: string): string => {
    if (!value) return 'Niet ingevuld'
    if (fieldType === 'image' && value instanceof File) {
      return value.name
    }
    if (typeof value === 'string') {
      return value.length > 50 ? value.substring(0, 50) + '...' : value
    }
    return String(value)
  }

  // Filter options that have values
  const filledOptions = options.filter((option) => personalization[option.fieldName]?.value)

  return (
    <div className={`personalization-summary-card border-2 border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50">
        <h3 className="text-[16px] font-bold text-gray-900">Personalisatie Overzicht</h3>
        <p className="text-[12px] text-gray-600 mt-0.5">
          {filledOptions.length} van {options.length} velden ingevuld
        </p>
      </div>

      {/* Personalization Items */}
      <div className="p-4 space-y-3">
        {filledOptions.length > 0 ? (
          filledOptions.map((option) => {
            const value = personalization[option.fieldName]?.value
            const displayValue = formatValue(value, option.fieldType)

            return (
              <div
                key={option.fieldName}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50"
              >
                {/* Left: Icon + Field Info */}
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-600 rounded-md">
                    {getFieldIcon(option.fieldType)}
                  </div>

                  {/* Field Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900">{option.fieldName}</p>
                    <p className="text-[12px] text-gray-600 truncate" title={displayValue}>
                      {displayValue}
                    </p>
                    {option.priceModifier && option.priceModifier !== 0 && (
                      <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
                        {option.priceModifier > 0 ? '+' : ''}€{formatPriceStr(option.priceModifier)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Edit Button */}
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="btn btn-outline-neutral btn-sm flex-shrink-0 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" strokeWidth={2.5} />
                    Bewerk
                  </button>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-6">
            <p className="text-[14px] text-gray-500">Nog geen personalisatie toegevoegd</p>
          </div>
        )}
      </div>

      {/* Footer: Total Cost */}
      {filledOptions.length > 0 && totalCost !== 0 && (
        <div className="px-4 py-3 border-t-2 border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-gray-900">
              Totale personalisatie kosten:
            </span>
            <span className="text-[16px] font-mono font-bold text-teal-600">
              {totalCost > 0 ? '+' : ''}€{formatPriceStr(totalCost)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
