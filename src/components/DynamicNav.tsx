import Link from 'next/link'
import type { Navigation, Page } from '@/payload-types'

type Props = {
  navigation?: Navigation | null
}

/**
 * DynamicNav Component
 *
 * 100% CMS-driven navigation component
 * Renders menu items from Navigation global
 * Supports nested submenus
 *
 * Framework principle: "Build reusable components" - payload-website-framework-b2b-b2c.md
 */
export async function DynamicNav({ navigation }: Props) {
  if (!navigation?.items || navigation.items.length === 0) {
    return null
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 flex gap-0 justify-center items-center">
        {/* Main menu items */}
        {navigation.items.filter(Boolean).map((item, index) => {
          if (!item) return null

          // Get the link URL
          let href = '#'
          if (item.type === 'page' && item.page) {
            const page = item.page as Page
            href = `/${page.slug === 'home' ? '' : page.slug}`
          } else if (item.type === 'external' && item.url) {
            href = item.url
          }

          return (
            <div key={index} className="relative group">
              <Link
                href={href}
                className="px-4 py-3.5 text-sm font-medium text-gray-900 hover:text-primary hover:bg-primary/5 cursor-pointer transition-all relative group whitespace-nowrap flex items-center gap-2"
              >
                <span>{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <span className="text-xs">▼</span>
                )}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300"></div>
              </Link>

              {/* Submenu (if exists) */}
              {item.children && item.children.length > 0 && (
                <div className="absolute left-0 top-full mt-0 bg-white border shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {item.children.filter(Boolean).map((child, childIndex) => {
                    if (!child) return null

                    const childPage = child.page as Page
                    const childHref = childPage ? `/${childPage.slug === 'home' ? '' : childPage.slug}` : '#'

                    return (
                      <Link
                        key={childIndex}
                        href={childHref}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* CTA Button (optional) */}
        {navigation.ctaButton?.show && navigation.ctaButton.text && (
          <Link
            href={navigation.ctaButton.link || '#'}
            className="ml-4 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {navigation.ctaButton.text}
          </Link>
        )}
      </div>
    </nav>
  )
}
