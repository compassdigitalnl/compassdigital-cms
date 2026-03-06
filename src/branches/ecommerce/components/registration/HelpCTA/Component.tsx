'use client'

import React from 'react'
import { Phone } from 'lucide-react'
import type { HelpCTAProps } from './types'

export const HelpCTA: React.FC<HelpCTAProps> = ({
  title = 'Hulp bij aanmelden?',
  description = 'Ons team helpt u graag door het registratieproces.',
  phone = '',
  phoneLabel,
  className = '',
}) => {
  // Don't render phone link if no phone configured
  const hasPhone = !!phone

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-navy to-theme-navy-light p-6 text-center ${className}`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-5 -top-5 h-[100px] w-[100px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)',
        }}
      />

      <h4 className="relative mb-1.5 font-heading text-base font-extrabold text-white">
        {title}
      </h4>
      <p className="relative mb-3.5 text-[13px] text-white/[0.45]">
        {description}
      </p>
      {hasPhone && (
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          className="relative inline-flex items-center gap-1.5 text-sm font-bold text-theme-teal-light no-underline transition-colors hover:text-white"
        >
          <Phone className="h-4 w-4" />
          {phoneLabel || phone}
        </a>
      )}
    </div>
  )
}
