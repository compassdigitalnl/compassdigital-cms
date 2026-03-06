'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { CheckoutStepsProps } from './types'

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  steps,
  className = '',
}) => {
  return (
    <div className={`py-5 ${className}`}>
      <div className="mx-auto flex max-w-[500px] items-center gap-0">
        {steps.map((step, i) => (
          <div key={i} className="relative flex-1 text-center">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-1/2 right-[-50%] top-[15px] z-[1] h-0.5 ${
                  step.status === 'done'
                    ? 'bg-[var(--color-primary)]'
                    : 'bg-[var(--color-border,#E8ECF1)]'
                }`}
              />
            )}

            {/* Dot */}
            <div
              className={`relative z-[2] mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ${
                step.status === 'done'
                  ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : step.status === 'active'
                    ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface,white)] text-[var(--color-primary)] shadow-[0_0_0_3px_var(--color-primary-glow)]'
                    : 'border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] text-[var(--color-text-muted)]'
              }`}
            >
              {step.status === 'done' ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>

            {/* Label */}
            <div
              className={`text-[11px] font-semibold ${
                step.status === 'done'
                  ? 'text-[var(--color-text-primary)]'
                  : step.status === 'active'
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)]'
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
