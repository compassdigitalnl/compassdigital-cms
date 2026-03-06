'use client'

import React from 'react'
import { Building2, User } from 'lucide-react'
import { StepNavigation } from '@/branches/ecommerce/components/registration'
import type { AccountType } from './types'

interface StepAccountTypeProps {
  selected: AccountType | null
  onSelect: (type: AccountType) => void
  onNext: () => void
}

const options: { id: AccountType; icon: typeof Building2; label: string; description: string }[] = [
  {
    id: 'b2b',
    icon: Building2,
    label: 'Zakelijk (B2B)',
    description: 'Voor bedrijven, praktijken en instellingen',
  },
  {
    id: 'b2c',
    icon: User,
    label: 'Particulier (B2C)',
    description: 'Voor particuliere klanten',
  },
]

export const StepAccountType: React.FC<StepAccountTypeProps> = ({
  selected,
  onSelect,
  onNext,
}) => {
  return (
    <div
      className="rounded-[20px] border bg-white p-9"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mb-1.5 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <User className="h-[22px] w-[22px] text-theme-teal" />
        Kies uw account type
      </div>
      <p className="mb-7 text-[15px] leading-relaxed text-theme-grey-dark">
        Selecteer het type account dat het beste bij u past.
      </p>

      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = selected === option.id
          const Icon = option.icon

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`
                flex flex-col items-center gap-2.5 rounded-[14px] border-2 p-5
                text-center transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'border-theme-teal bg-[var(--color-primary-glow)] shadow-[0_0_0_4px_var(--color-primary-glow)]'
                  : 'hover:border-theme-teal hover:bg-[var(--color-primary-glow)]'
                }
              `}
              style={!isActive ? { borderColor: 'var(--color-border)' } : undefined}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isActive ? 'bg-theme-teal text-white' : ''
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? '' : 'text-theme-teal'}`} />
              </div>
              <div className="font-heading text-[15px] font-extrabold text-theme-navy">
                {option.label}
              </div>
              <div className="text-xs text-theme-grey-mid">{option.description}</div>
            </button>
          )
        })}
      </div>

      <StepNavigation onNext={onNext} showBack={false} />
    </div>
  )
}
