import Link from 'next/link'
import { ChevronRight, Home, LucideIcon } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'default' | 'pills' | 'icons'
}

export function Breadcrumb({ items, variant = 'default' }: BreadcrumbProps) {
  if (variant === 'pills') {
    return (
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="px-2.5 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-600 font-semibold rounded-full">
                    {item.label}
                  </span>
                )}
                {!isLast && <span className="text-gray-400">›</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  if (variant === 'icons') {
    return (
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const Icon = item.icon

            return (
              <li key={index} className="flex items-center gap-1.5">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-navy-900 font-semibold">
                    {Icon && <Icon className="w-3.5 h-3.5 text-teal-600" />}
                    {item.label}
                  </span>
                )}
                {!isLast && <span className="text-gray-400">›</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  // Default variant
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-gray-600 hover:text-teal-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-navy-900 font-semibold">{item.label}</span>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
