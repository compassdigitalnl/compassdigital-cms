'use client'

import React from 'react'
import { Package, Check, ShoppingCart } from 'lucide-react'
import { resolveIcon } from '../iconMap'
import type { BranchPackageGridProps } from './types'

export const BranchPackageGrid: React.FC<BranchPackageGridProps> = ({
  title = 'Starterspakketten',
  titleIcon: titleIconName,
  packages,
  className = '',
}) => {
  const TitleIcon = titleIconName ? resolveIcon(titleIconName) ?? Package : Package
  return (
    <section className={className}>
      <h2 className="mb-4 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <TitleIcon className="h-[22px] w-[22px] text-theme-teal" />
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {packages.map((pkg, index) => {
          const BtnIcon = (pkg.buttonIcon ? resolveIcon(pkg.buttonIcon) : null) || ShoppingCart

          return (
            <div
              key={index}
              className={`
                relative flex flex-col overflow-hidden rounded-2xl border-[1.5px] bg-white
                transition-all duration-[250ms]
                hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)]
                ${pkg.featured ? 'border-theme-teal hover:border-theme-teal' : 'hover:border-theme-teal'}
              `}
              style={!pkg.featured ? { borderColor: 'var(--color-border)' } : undefined}
            >
              {/* Featured badge */}
              {pkg.featured && pkg.featuredLabel && (
                <span className="absolute right-3 top-3 rounded-full bg-theme-teal px-2.5 py-1 text-[11px] font-bold text-white">
                  {pkg.featuredLabel}
                </span>
              )}

              {/* Header */}
              <div
                className="border-b px-6 pb-4 pt-6"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="mb-1 font-heading text-lg font-extrabold text-theme-navy">
                  {pkg.name}
                </div>
                <div className="text-[13px] text-theme-grey-mid">{pkg.description}</div>
                <div className="mt-2 font-heading text-[28px] font-extrabold text-theme-teal">
                  {pkg.price}
                  {pkg.priceSuffix && (
                    <span className="text-sm font-normal text-theme-grey-mid"> {pkg.priceSuffix}</span>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 px-6 py-4">
                {pkg.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-theme-navy">
                    <Check className="h-4 w-4 flex-shrink-0 text-[var(--color-success)]" />
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-4">
                <button
                  type="button"
                  onClick={pkg.onOrder}
                  className={`
                    flex w-full items-center justify-center gap-2 rounded-xl
                    h-12 text-sm font-bold transition-all duration-200 cursor-pointer
                    ${pkg.buttonVariant === 'outline'
                      ? 'border-[1.5px] bg-white text-theme-navy hover:border-theme-teal hover:text-theme-teal'
                      : 'border-none bg-theme-teal text-white hover:bg-theme-navy'
                    }
                  `}
                  style={pkg.buttonVariant === 'outline' ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  <BtnIcon className="h-[17px] w-[17px]" />
                  {pkg.buttonLabel || 'Bestellen'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
