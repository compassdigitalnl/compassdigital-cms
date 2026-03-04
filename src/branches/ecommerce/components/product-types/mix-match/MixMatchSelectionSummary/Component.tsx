'use client'

import React from 'react'
import { X } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export interface SelectedItem {
  id: string
  name: string
  emoji?: string
  icon?: React.ReactNode
  detail?: string
  quantity: number
  price: number
}

export interface MixMatchSelectionSummaryProps {
  items: SelectedItem[]
  onRemove?: (itemId: string) => void
  maxHeight?: string
  className?: string
}

export const MixMatchSelectionSummary: React.FC<MixMatchSelectionSummaryProps> = ({
  items,
  onRemove,
  maxHeight = '260px',
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  return (
    <div
      className={`box-items flex flex-col gap-1 overflow-y-auto ${className}`}
      style={{ maxHeight }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="bi flex items-center gap-2 p-1.5 px-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          {/* Icon/Emoji */}
          <div className="bi-icon text-lg flex-shrink-0">
            {item.emoji || item.icon}
          </div>

          {/* Info */}
          <div className="bi-info flex-1 min-w-0">
            <div className="bi-name text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {item.name}
            </div>
            {item.detail && (
              <div className="bi-detail text-[10px] text-gray-500">
                {item.detail}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="bi-qty font-mono text-[11px] font-bold bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
            ×{item.quantity}
          </div>

          {/* Price */}
          <div className="bi-price font-mono text-[11px] font-bold flex-shrink-0">
            €{formatPriceStr(item.price)}
          </div>

          {/* Remove button */}
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="bi-remove w-5 h-5 rounded border-none bg-transparent cursor-pointer flex items-center justify-center transition-all hover:bg-red-50 flex-shrink-0"
              aria-label={`Remove ${item.name}`}
            >
              <X className="w-3 h-3 text-red-400" />
            </button>
          )}
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400">
          Nog geen items geselecteerd
        </div>
      )}
    </div>
  )
}

export default MixMatchSelectionSummary
