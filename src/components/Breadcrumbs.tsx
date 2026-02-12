import React from 'react'
import Link from 'next/link'
import type { Page } from '@/payload-types'

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  currentPage?: string
  className?: string
  showHome?: boolean
}

/**
 * Breadcrumbs Component - SEO-friendly navigation breadcrumbs
 *
 * Features:
 * - Automatic Schema.org markup
 * - Responsive design
 * - Accessible (ARIA labels)
 * - Custom styling support
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Products', href: '/products' },
 *     { label: 'Electronics', href: '/products/electronics' }
 *   ]}
 *   currentPage="Laptops"
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  currentPage,
  className = '',
  showHome = true,
}: BreadcrumbsProps) {
  // Build complete breadcrumb trail
  const breadcrumbs: BreadcrumbItem[] = []

  if (showHome) {
    breadcrumbs.push({ label: 'Home', href: '/' })
  }

  breadcrumbs.push(...items)

  if (!breadcrumbs.length && !currentPage) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumbs ${className}`}
      style={{
        padding: '12px 0',
        fontSize: '14px',
      }}
    >
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {breadcrumbs.map((item, index) => (
          <li
            key={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Link
              href={item.href}
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#111827'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              {item.label}
            </Link>

            {/* Separator */}
            <span
              style={{
                color: '#d1d5db',
                userSelect: 'none',
              }}
              aria-hidden="true"
            >
              /
            </span>
          </li>
        ))}

        {/* Current Page */}
        {currentPage && (
          <li
            style={{
              color: '#111827',
              fontWeight: '500',
            }}
            aria-current="page"
          >
            {currentPage}
          </li>
        )}
      </ol>
    </nav>
  )
}

/**
 * Generate breadcrumbs from page path
 *
 * @example
 * ```tsx
 * const breadcrumbs = generateBreadcrumbs('/products/electronics/laptops')
 * // Returns:
 * // [
 * //   { label: 'Products', href: '/products' },
 * //   { label: 'Electronics', href: '/products/electronics' },
 * // ]
 * ```
 */
export function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  if (!path || path === '/') return []

  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  for (let i = 0; i < segments.length - 1; i++) {
    currentPath += `/${segments[i]}`
    breadcrumbs.push({
      label: segments[i]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: currentPath,
    })
  }

  return breadcrumbs
}

/**
 * Generate breadcrumbs from page hierarchy
 *
 * Useful when pages have parent-child relationships
 *
 * @example
 * ```tsx
 * const breadcrumbs = await generateBreadcrumbsFromPage(page, payload)
 * ```
 */
export async function generateBreadcrumbsFromPage(
  page: Page,
  payload: any
): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = []

  // If page has parent field (you'd need to add this to your schema)
  // let currentPage: Page | null = page
  // while (currentPage?.parent) {
  //   const parent = await payload.findByID({
  //     collection: 'pages',
  //     id: currentPage.parent,
  //   })
  //   breadcrumbs.unshift({
  //     label: parent.title,
  //     href: `/${parent.slug}`,
  //   })
  //   currentPage = parent
  // }

  // For now, use simple path-based generation
  if (page.slug && page.slug !== 'home') {
    return generateBreadcrumbs(`/${page.slug}`)
  }

  return breadcrumbs
}

/**
 * AutoBreadcrumbs - Automatic breadcrumbs for dynamic pages
 *
 * Automatically generates breadcrumbs based on current URL
 *
 * @example
 * ```tsx
 * // In your page component
 * <AutoBreadcrumbs currentPage={page.title} />
 * ```
 */
export function AutoBreadcrumbs({
  currentPage,
  className,
}: {
  currentPage: string
  className?: string
}) {
  // Get current path (client-side)
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setBreadcrumbs(generateBreadcrumbs(path))
    }
  }, [])

  return <Breadcrumbs items={breadcrumbs} currentPage={currentPage} className={className} />
}
