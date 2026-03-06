'use client'

import React from 'react'
import { Package, Check } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export interface AddOn {
  id: string
  label: string
  description?: string
  price: number
  required?: boolean
  selected: boolean
  icon?: React.ReactNode
}

export interface AddOnSelectorProps {
  addOns: AddOn[]
  onChange: (addOnId: string, selected: boolean) => void
  layout?: 'grid' | 'list'
  className?: string
}

export const AddOnSelector: React.FC<AddOnSelectorProps> = ({
  addOns,
  onChange,
  layout = 'list',
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
    list: 'flex flex-col gap-2',
  }

  return (
    <div className={`addon-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-base font-extrabold text-gray-900">
          Extra opties
        </h3>
      </div>

      {/* Add-ons */}
      <div className={layoutClasses[layout]}>
        {addOns.map((addOn) => {
          const isSelected = addOn.selected
          const isRequired = addOn.required

          return (
            <button
              key={addOn.id}
              onClick={() => !isRequired && onChange(addOn.id, !isSelected)}
              disabled={isRequired}
              className={`
                addon-item relative p-4 rounded-xl border-[1.5px] transition-all text-left
                ${layout === 'list' ? 'flex items-center gap-3' : 'flex flex-col'}
                ${isRequired ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected && !isRequired ? 'bg-[var(--color-primary-glow)] border-[var(--color-primary)]' : 'bg-white border-gray-200'}
                ${!isSelected && !isRequired ? 'hover:border-gray-300 hover:shadow-sm' : ''}
              `}
            >
              {/* Checkbox */}
              <div
                className={`
                  w-5 h-5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors
                  ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-gray-300'}
                  ${isRequired ? 'opacity-50' : ''}
                `}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Content */}
              <div className={`flex-1 ${layout === 'grid' ? 'mt-3' : ''}`}>
                {/* Label */}
                <div className="flex items-center gap-2 mb-1">
                  {addOn.icon && <span className="text-lg">{addOn.icon}</span>}
                  <span className="text-sm font-bold text-gray-900">
                    {addOn.label}
                  </span>
                  {isRequired && (
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide">
                      Verplicht
                    </span>
                  )}
                </div>

                {/* Description */}
                {addOn.description && (
                  <div className="text-xs text-gray-500 mb-2">
                    {addOn.description}
                  </div>
                )}

                {/* Price */}
                <div className={`text-sm font-bold font-mono ${isSelected ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                  {addOn.price === 0 ? 'Gratis' : `+€${formatPriceStr(addOn.price)}`}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* No add-ons message */}
      {addOns.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400">
          Geen extra opties beschikbaar
        </div>
      )}
    </div>
  )
}

export default AddOnSelector
