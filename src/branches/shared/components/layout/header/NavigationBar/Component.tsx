'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  ChevronDown,
  Phone,
  Mail,
  Flame,
  Star,
  Sparkles,
  Gift,
  Package,
  Tag,
  Zap,
  Building2,
  Award,
  FileText,
  Home,
} from 'lucide-react'
import { cn } from '@/utilities/cn'
import { CMSLink } from '@/branches/shared/components/common/Link'
import { MegaNav } from '../MegaNav'
import { useCategoryNavigation } from '../hooks/useCategoryNavigation'
import type { NavigationBarProps } from './types'

const iconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  Star,
  Sparkles,
  Gift,
  Package,
  Tag,
  Zap,
  Building2,
  Award,
  FileText,
  Home,
  Menu,
}

export function NavigationBar({ navigation, theme, settings }: NavigationBarProps) {
  const pathname = usePathname()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [navTop, setNavTop] = useState(0)

  const primaryColor = theme?.teal || '#00897B'
  const secondaryColor = theme?.navy || '#0A1628'

  const categoryNav = useCategoryNavigation()

  const navItems =
    navigation.mode === 'manual' || navigation.mode === 'hybrid'
      ? navigation.items || []
      : []

  const specialItems = navigation.specialItems || []
  const startItems = specialItems.filter((item: any) => item.position === 'start')
  const endItems = specialItems.filter((item: any) => item.position === 'end')
  const showCTA = navigation.ctaButton?.show && navigation.ctaButton?.text

  useEffect(() => {
    const updateNavPosition = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        setNavTop(rect.bottom)
      }
    }
    updateNavPosition()
    window.addEventListener('scroll', updateNavPosition)
    window.addEventListener('resize', updateNavPosition)
    return () => {
      window.removeEventListener('scroll', updateNavPosition)
      window.removeEventListener('resize', updateNavPosition)
    }
  }, [])

  // Fetch root categories when menu opens
  useEffect(() => {
    if (megaMenuOpen && categoryNav.rootCategories.length === 0 && !categoryNav.error) {
      categoryNav.fetchRootCategories()
    }
  }, [megaMenuOpen])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && megaMenuOpen) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [megaMenuOpen])

  return (
    <>
      <nav
        ref={navRef}
        className="hidden lg:block bg-white border-b sticky top-[72px] z-[40]"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="flex items-stretch h-12">
            {/* Menu Trigger Button */}
            {(navigation.mode === 'categories' || navigation.mode === 'hybrid') && (
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={cn(
                  'flex items-center gap-2 px-5 text-sm font-bold transition-all border-b-2 text-white',
                )}
                style={{
                  backgroundColor: megaMenuOpen ? primaryColor : secondaryColor,
                  borderColor: megaMenuOpen ? primaryColor : secondaryColor,
                }}
                onMouseEnter={(e: any) => {
                  if (!megaMenuOpen) {
                    e.currentTarget.style.backgroundColor = primaryColor
                    e.currentTarget.style.borderColor = primaryColor
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!megaMenuOpen) {
                    e.currentTarget.style.backgroundColor = secondaryColor
                    e.currentTarget.style.borderColor = secondaryColor
                  }
                }}
              >
                <Menu className="w-4 h-4" />
                Menu
                <ChevronDown
                  className={cn('w-3.5 h-3.5 transition-transform', megaMenuOpen && 'rotate-180')}
                />
              </button>
            )}

            {/* Start Special Items */}
            {startItems.map((item: any, index: number) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <Link
                  key={`start-${index}`}
                  href={item.url || '#'}
                  className={cn(
                    'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                    item.highlight
                      ? 'text-[#FF6B6B] hover:border-[#FF6B6B]'
                      : 'hover:border-[var(--color-primary)]',
                  )}
                  style={{ color: item.highlight ? '#FF6B6B' : 'var(--color-secondary)' }}
                  onMouseEnter={(e: any) => {
                    if (!item.highlight) e.currentTarget.style.color = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e: any) => {
                    if (!item.highlight) e.currentTarget.style.color = 'var(--color-secondary)'
                  }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}

            {/* Manual/Hybrid Navigation Items */}
            {navItems.map((item: any) => {
              const hasChildren = item.children && item.children.length > 0
              const Icon = item.icon ? iconMap[item.icon as string] : null
              const isActive =
                item.type === 'page' && item.page
                  ? typeof item.page === 'object' &&
                    'slug' in item.page &&
                    pathname.includes((item.page as any).slug as string)
                  : item.url && item.url !== '/' && pathname.includes(item.url)

              return (
                <div key={item.id} className="relative group">
                  {hasChildren ? (
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-full',
                        isActive
                          ? 'border-[var(--color-primary)]'
                          : 'border-transparent hover:border-[var(--color-primary)]',
                      )}
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                      }}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  ) : (
                    <CMSLink
                      {...(item.type === 'page'
                        ? { reference: item.page }
                        : { url: item.url })}
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-12',
                        isActive
                          ? 'border-[var(--color-primary)]'
                          : 'border-transparent hover:border-[var(--color-primary)]',
                      )}
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                      }}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </CMSLink>
                  )}

                  {/* Simple Dropdown for children */}
                  {hasChildren && (
                    <div
                      className="absolute top-full left-0 bg-white border rounded-b-xl shadow-lg min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[195]"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      {(item.children as any[])!.map((child: any) => (
                        <CMSLink
                          key={child.id}
                          {...(typeof child.page === 'object' && 'slug' in child.page
                            ? { reference: child.page }
                            : {})}
                          className="block px-4 py-2 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                          style={{ color: 'var(--color-secondary)' }}
                          onMouseEnter={(e: any) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                            e.currentTarget.style.color = 'var(--color-primary)'
                          }}
                          onMouseLeave={(e: any) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--color-secondary)'
                          }}
                        >
                          {child.label}
                        </CMSLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* End Special Items */}
            {endItems.map((item: any, index: number) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <Link
                  key={`end-${index}`}
                  href={item.url || '#'}
                  className={cn(
                    'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                    item.highlight
                      ? 'text-[#FF6B6B] hover:border-[#FF6B6B]'
                      : 'hover:border-[var(--color-primary)]',
                  )}
                  style={{ color: item.highlight ? '#FF6B6B' : 'var(--color-secondary)' }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Contact Info */}
            <div className="flex items-center gap-5 text-xs">
              {settings?.email && (
                <>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-1.5 transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                    <span className="hidden xl:inline">{settings.email}</span>
                  </a>
                  {settings?.phone && (
                    <div
                      className="w-px h-4"
                      style={{ backgroundColor: 'var(--color-border)' }}
                    />
                  )}
                </>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="hidden xl:inline">{settings.phone}</span>
                </a>
              )}
            </div>

            {/* CTA Button */}
            {showCTA && (
              <Link
                href={navigation.ctaButton?.link || '/contact'}
                className="ml-4 flex items-center px-5 text-sm font-bold text-white transition-all border-b-2"
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              >
                {navigation.ctaButton?.text}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MegaNav flyout */}
      <MegaNav
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        navTop={navTop}
        categoryNav={categoryNav}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    </>
  )
}
