'use client'

import React from 'react'
import { Check, Plus, Minus, Flame, Clock } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/primitives/button'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { MixMatchProductCardProps } from './types'

export type { MixMatchProductCardProps }

export const MixMatchProductCard: React.FC<MixMatchProductCardProps> = ({
  id,
  name,
  image,
  emoji,
  price,
  priceIncluded = false,
  tag,
  calories,
  freshness,
  metadata,
  quantity,
  maxQuantity = 10,
  isSelected = false,
  onQuantityChange,
  onAdd,
  onRemove,
  onClick,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity < maxQuantity) {
      onQuantityChange?.(id, quantity + 1)
    }
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 0) {
      onQuantityChange?.(id, quantity - 1)
    }
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAdd?.(id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.(id)
  }

  const handleCardClick = () => {
    onClick?.(id)
  }

  const tagStyles = {
    popular: 'bg-amber-500 text-white',
    new: 'bg-[var(--color-primary)] text-white',
    vegan: 'bg-green text-white',
    spicy: 'bg-coral text-white',
  }

  // Default metadata
  const defaultMetadata = []
  if (calories) {
    defaultMetadata.push({
      icon: <Flame className="w-2.5 h-2.5" />,
      label: `${calories} kcal`,
    })
  }
  if (freshness) {
    defaultMetadata.push({
      icon: <Clock className="w-2.5 h-2.5" />,
      label: freshness,
    })
  }

  const displayMetadata = metadata || defaultMetadata

  return (
    <div
      className={`mm-product bg-white border-[1.5px] rounded-2xl overflow-hidden transition-all duration-150 relative cursor-pointer ${
        isSelected || quantity > 0
          ? 'border-[var(--color-primary)] shadow-[0_0_0_2px_var(--color-primary-glow)]'
          : 'border-grey-light hover:border-[var(--color-primary)]'
      } hover:-translate-y-0.5 hover:shadow-sm ${className}`}
      onClick={handleCardClick}
    >
      {/* Image area */}
      <div className="mmp-img h-32 flex items-center justify-center text-5xl relative bg-grey-light">
        {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
        {emoji && !image && <span>{emoji}</span>}

        {/* Tag */}
        {tag && (
          <div
            className={`mmp-tag absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
              tagStyles[tag.variant]
            }`}
          >
            {tag.label}
          </div>
        )}

        {/* Checkmark */}
        {(isSelected || quantity > 0) && (
          <div className="mmp-check absolute top-1.5 right-1.5 w-[26px] h-[26px] rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-md shadow-[var(--color-primary-light)]">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mmp-body p-2.5 px-3">
        <div className="mmp-name text-[13px] font-bold mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>

        {/* Meta information */}
        {displayMetadata.length > 0 && (
          <div className="mmp-meta text-[10px] text-grey-mid mb-1.5 flex gap-1.5">
            {displayMetadata.map((meta, index) => (
              <span key={index} className="flex items-center gap-0.5">
                {meta.icon}
                {meta.label}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mmp-footer flex items-center justify-between">
          {/* Price or "Included" */}
          {priceIncluded ? (
            <div className="mmp-price included text-green text-xs font-bold">
              Inbegrepen
            </div>
          ) : (
            <div className="mmp-price font-mono text-sm font-bold">
              € {formatPriceStr(price)}
            </div>
          )}

          {/* Quantity stepper or Add button */}
          {quantity > 0 ? (
            <div className="mmp-qty flex items-center gap-0 border-[1.5px] border-grey-light rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                className="btn btn-ghost btn-sm mmp-qty-btn w-7 h-7 flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="mmp-qty-val w-7 h-7 flex items-center justify-center font-mono text-xs font-extrabold bg-white">
                {quantity}
              </div>
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className="btn btn-ghost btn-sm mmp-qty-btn w-7 h-7 flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="btn btn-primary btn-sm mmp-add h-7 flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              Toevoegen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MixMatchProductCard
