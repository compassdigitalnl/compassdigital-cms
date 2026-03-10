import Link from 'next/link'
import type { CategoryPillsProps } from './types'

export function CategoryPills({ title, pills, className = '' }: CategoryPillsProps) {
  return (
    <div className={className}>
      {title && (
        <div className="text-xs font-bold text-gray-500 mb-1.5">{title}</div>
      )}
      <div className="flex flex-wrap gap-2">
        {pills.map((pill, index) => (
          <Link
            key={index}
            href={pill.href}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-[var(--color-navy)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] hover:bg-[color-mix(in_srgb,var(--color-teal)_8%,transparent)] transition-colors"
          >
            {pill.icon && <span>{pill.icon}</span>}
            <span>{pill.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
