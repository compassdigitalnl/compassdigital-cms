import React from 'react'
import type { RetourProgressBarProps } from './types'
import type { Step } from '../types'

export function RetourProgressBar({ currentStep }: RetourProgressBarProps) {
  const labels = ['Producten', 'Reden', 'Bevestigen']
  const stepNames: Step[] = ['select', 'reason', 'confirm']
  const currentIdx = stepNames.indexOf(currentStep)

  return (
    <div className="flex items-center gap-2">
      {labels.map((label, idx) => {
        const isActive = idx <= currentIdx
        return (
          <React.Fragment key={label}>
            {idx > 0 && (
              <div className={`flex-1 h-0.5 ${isActive ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-sm font-semibold hidden lg:inline ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
