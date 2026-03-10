'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import type { Category, MixMatchCategoryFilterProps } from './types'

export type { Category, MixMatchCategoryFilterProps }

export const MixMatchCategoryFilter: React.FC<MixMatchCategoryFilterProps> = ({
  categories,
  activeId,
  onChange,
  showCounts = true,
  className = '',
}) => {
  return (
    <div className={`cat-tabs flex gap-1 flex-wrap ${className}`}>
      {categories.map((category) => {
        const isActive = category.id === activeId
        const Icon = category.icon ? LucideIcons[category.icon] as React.ComponentType<{ className?: string }> : null

        return (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`btn cat-tab flex items-center gap-1.5 ${
              isActive
                ? 'btn-primary'
                : 'btn-outline-neutral'
            }`}
          >
            {/* Icon or Emoji */}
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {category.emoji && !Icon && <span>{category.emoji}</span>}

            {/* Label */}
            {category.label}

            {/* Count badge */}
            {showCounts && (
              <span
                className={`cat-count text-[10px] font-extrabold px-1.5 py-px rounded-full ${
                  isActive ? 'bg-white/25' : 'bg-gray-100'
                }`}
              >
                {category.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default MixMatchCategoryFilter
