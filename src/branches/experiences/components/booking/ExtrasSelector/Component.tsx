'use client'

import React from 'react'
import type { ExtrasSelectorProps, Extra } from './types'

export const ExtrasSelector: React.FC<ExtrasSelectorProps> = ({
  extras,
  selectedIds,
  onToggle,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-2 gap-3 md:grid-cols-3 ${className}`}
    >
      {extras.map((extra) => {
        const isSelected = selectedIds.includes(extra.id)

        return (
          <ExtraCard
            key={extra.id}
            extra={extra}
            isSelected={isSelected}
            onToggle={onToggle}
          />
        )
      })}
    </div>
  )
}

const ExtraCard: React.FC<{
  extra: Extra
  isSelected: boolean
  onToggle: (id: string) => void
}> = ({ extra, isSelected, onToggle }) => {
  return (
    <div className="relative">
      {/* Popular badge */}
      {extra.popular && (
        <span
          className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
        >
          Meest gekozen
        </span>
      )}

      <button
        type="button"
        onClick={() => onToggle(extra.id)}
        className={`
          relative flex w-full flex-col items-center rounded-xl border-2 p-4
          text-center transition-all duration-200
          hover:shadow-sm
          ${extra.popular ? 'mt-2' : ''}
        `}
        style={{
          borderColor: isSelected
            ? 'var(--color-teal, #00a39b)'
            : 'var(--color-border, #e5e7eb)',
          backgroundColor: isSelected
            ? 'var(--color-teal-light, #e6f7f6)'
            : 'var(--color-white, #ffffff)',
          boxShadow: isSelected
            ? '0 0 0 2px var(--color-teal, #00a39b)'
            : 'none',
        }}
      >
        {/* Icon */}
        <span className="mb-2 text-3xl">{extra.icon}</span>

        {/* Name */}
        <span
          className="mb-1 text-sm font-bold"
          style={{ color: 'var(--color-navy, #1a2b4a)' }}
        >
          {extra.name}
        </span>

        {/* Description */}
        <span className="mb-2 text-xs text-gray-500">
          {extra.description}
        </span>

        {/* Price */}
        <span
          className="text-sm font-extrabold"
          style={{ color: 'var(--color-teal, #00a39b)' }}
        >
          {extra.priceLabel}
        </span>
      </button>
    </div>
  )
}
