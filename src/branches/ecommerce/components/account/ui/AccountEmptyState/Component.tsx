import React from 'react'
import Link from 'next/link'
import { PackageOpen } from 'lucide-react'
import type { AccountEmptyStateProps } from './types'

export function AccountEmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: AccountEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
      >
        <Icon className="w-8 h-8" style={{ color: 'var(--color-primary, #00897B)' }} />
      </div>
      <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all text-white"
          style={{ background: 'var(--color-primary, #00897B)' }}
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all text-white"
          style={{ background: 'var(--color-primary, #00897B)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
