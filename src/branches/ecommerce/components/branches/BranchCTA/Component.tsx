'use client'

import React from 'react'
import Link from 'next/link'
import { UserPlus, Phone } from 'lucide-react'
import type { BranchCTAProps } from './types'

export const BranchCTA: React.FC<BranchCTAProps> = ({
  title,
  description,
  buttons = [
    { label: 'Klant worden', href: '/klant-worden', variant: 'primary' },
    { label: 'Adviesgesprek plannen', href: '/contact', variant: 'outline' },
  ],
  className = '',
}) => {
  const icons = [UserPlus, Phone]

  return (
    <section
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-12 text-center ${className}`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-5 -top-10 h-[250px] w-[250px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,137,123,0.08), transparent 70%)',
        }}
      />

      <h2
        className="relative mb-2 font-heading text-[26px] font-extrabold text-white"
        style={{ letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>

      {description && (
        <p className="relative mb-6 text-base text-white/[0.45]">{description}</p>
      )}

      <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
        {buttons.map((button, index) => {
          const Icon = icons[index] || UserPlus

          return (
            <Link
              key={index}
              href={button.href}
              className={`
                inline-flex items-center gap-2 rounded-xl px-7 py-3.5
                text-[15px] font-bold no-underline transition-all duration-200
                ${button.variant === 'primary'
                  ? 'border-none bg-theme-teal text-white shadow-[0_4px_16px_rgba(0,137,123,0.3)] hover:bg-theme-teal-light'
                  : 'border-2 border-white/20 bg-transparent text-white hover:border-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="h-[18px] w-[18px]" />
              {button.label}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
