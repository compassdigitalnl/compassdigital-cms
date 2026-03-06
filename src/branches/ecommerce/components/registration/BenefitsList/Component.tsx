'use client'

import React from 'react'
import { Gift } from 'lucide-react'
import type { BenefitsListProps } from './types'

export const BenefitsList: React.FC<BenefitsListProps> = ({
  title = 'Voordelen van een B2B account',
  titleIcon: TitleIcon = Gift,
  benefits,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mb-3.5 flex items-center gap-2 font-heading text-sm font-extrabold text-theme-navy">
        <TitleIcon className="h-4 w-4 text-theme-teal" />
        {title}
      </div>

      <div className="flex flex-col gap-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon

          return (
            <div key={index} className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: benefit.iconBg }}
              >
                <Icon className="h-[18px] w-[18px]" style={{ color: benefit.iconColor }} />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight text-theme-navy">
                  {benefit.title}
                </div>
                <div className="text-xs text-theme-grey-mid leading-snug">
                  {benefit.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
