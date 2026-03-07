'use client'

import React from 'react'
import Link from 'next/link'
import { CreditCard, ArrowRight } from 'lucide-react'
import type { MagazineSubscriptionCTAProps } from './types'

export const MagazineSubscriptionCTA: React.FC<MagazineSubscriptionCTAProps> = ({
  title,
  description,
  price,
  priceSuffix,
  buttonLabel = 'Bekijk abonnementen',
  buttonHref = '/abonneren',
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-10 md:p-12 ${className}`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-5 -top-10 h-[250px] w-[250px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        {/* Icon */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-glow)]">
          <CreditCard className="h-8 w-8 text-theme-teal-light" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2
            className="mb-1.5 font-heading text-[24px] font-extrabold text-white md:text-[26px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-base text-white/[0.45]">{description}</p>
          )}
        </div>

        {/* Price + Button */}
        <div className="flex flex-col items-center gap-3">
          {price && (
            <div className="text-center">
              <span className="font-heading text-[32px] font-extrabold text-theme-teal-light">
                {price}
              </span>
              {priceSuffix && (
                <span className="ml-1 text-sm text-white/40">{priceSuffix}</span>
              )}
            </div>
          )}
          <Link
            href={buttonHref}
            className="
              inline-flex items-center gap-2 rounded-xl border-none
              bg-theme-teal px-7 py-3.5 text-[15px] font-bold
              text-white no-underline shadow-[0_4px_16px_var(--color-primary-glow)]
              transition-all duration-200 hover:bg-theme-teal-light
            "
          >
            {buttonLabel}
            <ArrowRight className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
