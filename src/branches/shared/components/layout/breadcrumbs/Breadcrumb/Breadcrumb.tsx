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
  className?: string
}

/**
 * C19-Breadcrumbs - Hierarchical navigation breadcrumbs with 3 style variants
 *
 * Features:
 * - Default variant with chevron separators
 * - Pill-style variant with background chips
 * - Icon-enriched variant with category icons
 * - Semantic HTML with proper ARIA attributes
 * - SEO-friendly markup
 * - Theme variable compliant (no hardcoded colors)
 *
 * Design Tokens:
 * - Font size: 13px
 * - Link color: grey-mid (#94A3B8)
 * - Hover color: teal (#00897B)
 * - Current page: navy, not clickable
 * - Separators: aria-hidden="true" (decorative)
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Category' } // Current page (no href)
 *   ]}
 *   variant="default"
 * />
 * ```
 */
export function Breadcrumb({ items, variant = 'default', className = '' }: BreadcrumbProps) {
  if (variant === 'pills') {
    return (
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className="flex items-center gap-1"
          style={{
            fontSize: '13px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="px-2.5 py-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #F1F4F8)',
                      color: 'var(--color-grey-mid, #94A3B8)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-teal-glow, rgba(0, 137, 123, 0.12))'
                      e.currentTarget.style.color = 'var(--color-teal, #00897B)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-grey-light, #F1F4F8)'
                      e.currentTarget.style.color = 'var(--color-grey-mid, #94A3B8)'
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: 'var(--color-teal-glow, rgba(0, 137, 123, 0.12))',
                      color: 'var(--color-teal, #00897B)',
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span
                    style={{ color: 'var(--color-grey, #E8ECF1)' }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  if (variant === 'icons') {
    return (
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className="flex items-center gap-1.5"
          style={{
            fontSize: '13px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const Icon = item.icon

            return (
              <li key={index} className="flex items-center gap-1.5">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 transition-colors"
                    style={{
                      color: 'var(--color-grey-mid, #94A3B8)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-teal, #00897B)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-grey-mid, #94A3B8)'
                    }}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 font-semibold"
                    style={{
                      color: 'var(--color-navy, #0A1628)',
                    }}
                    aria-current="page"
                  >
                    {Icon && (
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: 'var(--color-teal, #00897B)' }}
                      />
                    )}
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span
                    style={{ color: 'var(--color-grey, #E8ECF1)' }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  // Default variant with chevron separators
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className="flex items-center gap-2"
        style={{
          fontSize: '13px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors"
                  style={{
                    color: 'var(--color-grey-mid, #94A3B8)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-teal, #00897B)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-grey-mid, #94A3B8)'
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-semibold"
                  style={{
                    color: 'var(--color-navy, #0A1628)',
                  }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5"
                  style={{ color: 'var(--color-grey, #E8ECF1)' }}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
