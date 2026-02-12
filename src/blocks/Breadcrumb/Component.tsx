import React from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import type { BreadcrumbBlock as BreadcrumbType } from '@/payload-types'

export const Breadcrumb: React.FC<BreadcrumbType> = ({
  mode = 'auto',
  items: manualItems,
  showHome = true,
  homeLabel = 'Home',
  separator = 'chevron',
  showOnMobile = true,
}) => {
  // Build breadcrumb items
  let breadcrumbItems: { label: string; link?: string }[] = []

  if (showHome) {
    breadcrumbItems.push({ label: homeLabel, link: '/' })
  }

  if (mode === 'manual' && manualItems) {
    breadcrumbItems = [...breadcrumbItems, ...manualItems]
  } else if (mode === 'auto') {
    // TODO: Generate from URL pathname
    // For now, just show home
  }

  if (breadcrumbItems.length <= 1) return null

  const separatorIcon = {
    arrow: 'ChevronRight',
    slash: 'Slash',
    chevron: 'ChevronRight',
    'double-chevron': 'ChevronsRight',
  }[separator] || 'ChevronRight'

  return (
    <nav
      className={`bg-gray-50 border-b border-gray-200 ${showOnMobile ? '' : 'hidden md:block'}`}
      aria-label="Breadcrumb"
    >
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-2 py-3 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1

            return (
              <li key={index} className="flex items-center gap-2">
                {item.link && !isLast ? (
                  <Link
                    href={item.link}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <Icon
                    name={separatorIcon}
                    size={16}
                    className="text-gray-400"
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
