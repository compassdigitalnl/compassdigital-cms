import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { AccountPageHeaderProps } from './types'

export function AccountPageHeader({
  title,
  subtitle,
  backHref,
  backLabel = 'Terug',
  actions,
}: AccountPageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm font-semibold mb-3 transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm lg:text-base text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
