'use client'

import React from 'react'
import { Phone } from 'lucide-react'
import type { HelpCTAProps } from './types'

export const HelpCTA: React.FC<HelpCTAProps> = ({
  title = 'Hulp bij aanmelden?',
  description = 'Ons team helpt u graag door het registratieproces.',
  phone = '0251247233',
  phoneLabel = '0251\u2011247233',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-navy to-theme-navy-light p-6 text-center ${className}`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-5 -top-5 h-[100px] w-[100px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,137,123,0.1), transparent 70%)',
        }}
      />

      <h4 className="relative mb-1.5 font-heading text-base font-extrabold text-white">
        {title}
      </h4>
      <p className="relative mb-3.5 text-[13px] text-white/[0.45]">
        {description}
      </p>
      <a
        href={`tel:${phone}`}
        className="relative inline-flex items-center gap-1.5 text-sm font-bold text-theme-teal-light no-underline transition-colors hover:text-white"
      >
        <Phone className="h-4 w-4" />
        {phoneLabel}
      </a>
    </div>
  )
}
