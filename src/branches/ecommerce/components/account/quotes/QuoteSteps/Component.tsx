'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import type { QuoteStepsProps } from './types'

const DEFAULT_STEPS = [
  {
    number: 1,
    title: 'Producten selecteren',
    description: 'Voeg producten en aantallen toe',
  },
  {
    number: 2,
    title: 'Gegevens invullen',
    description: 'Uw bedrijfs- en contactinformatie',
  },
  {
    number: 3,
    title: 'Offerte ontvangen',
    description: 'Binnen 24 uur in uw inbox',
  },
  {
    number: 4,
    title: 'Bestellen',
    description: 'Akkoord? Direct omzetten in bestelling',
  },
]

export function QuoteSteps({ steps = DEFAULT_STEPS }: QuoteStepsProps) {
  return (
    <div className="bg-white border rounded-2xl p-6 mb-4" style={{ borderColor: 'var(--color-border, #E8ECF1)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4" style={{ color: 'var(--color-primary, #00897B)' }} />
        <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-foreground, #0A1628)', fontFamily: 'var(--font-heading, inherit)' }}>
          Hoe het werkt
        </h3>
      </div>
      <div className="flex flex-col gap-3.5">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
              style={{
                background: 'rgba(0,137,123,0.10)',
                color: 'var(--color-primary, #00897B)',
              }}
            >
              {step.number}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground, #0A1628)' }}>
                {step.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted, #94A3B8)' }}>
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
