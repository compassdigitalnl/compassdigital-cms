'use client'

import React from 'react'
import { resolveIcon } from '../iconMap'
import type { BranchUSPCardsProps } from './types'

export const BranchUSPCards: React.FC<BranchUSPCardsProps> = ({
  cards,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {cards.map((card, index) => {
        const Icon = resolveIcon(card.icon)

        return (
          <div
            key={index}
            className="
              rounded-[14px] border bg-white p-5 text-center
              transition-all duration-200
              hover:-translate-y-0.5 hover:border-theme-teal
            "
            style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
          >
            <div
              className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: card.iconBg }}
            >
              {Icon && <Icon className="h-[22px] w-[22px]" style={{ color: card.iconColor }} />}
            </div>
            <div className="mb-1 font-heading text-sm font-extrabold text-theme-navy">
              {card.title}
            </div>
            <div className="text-[13px] leading-snug text-theme-grey-mid">
              {card.description}
            </div>
          </div>
        )
      })}
    </div>
  )
}
