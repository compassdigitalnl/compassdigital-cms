'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Phone, Mail } from 'lucide-react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { cn } from '@/utilities/cn'
import { CMSLink } from '@/branches/shared/components/common/Link'
import { MegaNav } from '@/globals/site/header/components/MegaNav'
import { useCategoryNavigation } from '@/globals/site/header/components/hooks/useCategoryNavigation'
import type { NavigationBarProps } from './types'

export function NavigationBar({ navigation, theme, settings }: NavigationBarProps) {
  const pathname = usePathname()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [navTop, setNavTop] = useState(0)

  const primaryColor = 'var(--color-primary)'
  const secondaryColor = 'var(--color-secondary)'

  const categoryNav = useCategoryNavigation()

  const navItems =
    navigation.mode === 'manual' || navigation.mode === 'hybrid'
      ? navigation.items || []
      : []

  const specialItems = navigation.specialItems || []
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
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!megaMenuOpen) {
                    e.currentTarget.style.backgroundColor = primaryColor
                    e.currentTarget.style.borderColor = primaryColor
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
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

            {/* Manual/Hybrid Navigation Items */}
            {navItems.map((item: any) => {
              const subItems = item.subItems || item.children || []
              const hasChildren = subItems.length > 0
              const isMega = item.type === 'mega' && item.megaColumns?.length > 0
              const hasDropdown = hasChildren || isMega
              const isActive =
                item.type === 'page' && item.page
                  ? typeof item.page === 'object' &&
                    'slug' in item.page &&
                    pathname.includes((item.page as any).slug as string)
                  : item.url && item.url !== '/' && pathname.includes(item.url)

              return (
                <div key={item.id} className="relative group">
                  {hasDropdown ? (
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
                      {item.icon && <Icon name={item.icon} size={16} />}
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
                      {item.icon && <Icon name={item.icon} size={16} />}
                      {item.label}
                    </CMSLink>
                  )}

                  {/* Mega Menu Dropdown */}
                  {isMega && (
                    <div
                      className="absolute top-full left-0 bg-white border rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[195]"
                      style={{ borderColor: 'var(--color-border)', minWidth: `${Math.min(item.megaColumns.length * 220, 880)}px` }}
                    >
                      <div className="grid gap-0 p-5" style={{ gridTemplateColumns: `repeat(${item.megaColumns.length}, 1fr)` }}>
                        {item.megaColumns.map((col: any, colIdx: number) => (
                          <div key={col.id || colIdx} className={cn('px-3', colIdx > 0 && 'border-l border-[var(--color-border)]')}>
                            {col.title && (
                              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                                {col.title}
                              </h4>
                            )}
                            <ul className="space-y-1">
                              {(col.links || []).map((link: any, linkIdx: number) => (
                                <li key={link.id || linkIdx}>
                                  <Link
                                    href={link.url || '#'}
                                    className="flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[var(--color-surface)]"
                                    style={{ color: 'var(--color-secondary)' }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                      e.currentTarget.style.color = 'var(--color-primary)'
                                    }}
                                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                      e.currentTarget.style.color = 'var(--color-secondary)'
                                    }}
                                  >
                                    {link.icon && <Icon name={link.icon} size={16} className="mt-0.5 shrink-0" />}
                                    <div>
                                      <span className="font-medium">{link.label}</span>
                                      {link.description && (
                                        <p className="mt-0.5 text-xs opacity-60 leading-snug">{link.description}</p>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simple Dropdown for subItems */}
                  {hasChildren && !isMega && (
                    <div
                      className="absolute top-full left-0 bg-white border rounded-b-xl shadow-lg min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[195]"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      {subItems.map((child: any) => (
                        <CMSLink
                          key={child.id}
                          {...(typeof child.page === 'object' && 'slug' in child.page
                            ? { reference: child.page }
                            : {})}
                          className="block px-4 py-2 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                          style={{ color: 'var(--color-secondary)' }}
                          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                            e.currentTarget.style.color = 'var(--color-primary)'
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
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

            {/* Special Items */}
            {specialItems.map((item: any, index: number) => (
              <Link
                key={`special-${index}`}
                href={item.url || '#'}
                className={cn(
                  'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                  item.highlight
                    ? 'text-[var(--color-error)] hover:border-[var(--color-error)]'
                    : 'hover:border-[var(--color-primary)]',
                )}
                style={{ color: item.highlight ? 'var(--color-error)' : 'var(--color-secondary)' }}
              >
                {item.icon && <Icon name={item.icon} size={16} />}
                {item.label}
              </Link>
            ))}

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
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="hidden xl:inline">{settings.phone}</span>
                </a>
              )}
            </div>

            {/* CTA Button */}
            {showCTA && (() => {
              const ctaStyle = (navigation.ctaButton as any)?.style || 'primary'
              const ctaClasses = ctaStyle === 'outline'
                ? 'border-2 bg-transparent'
                : ctaStyle === 'secondary'
                  ? 'text-white border-b-2'
                  : 'text-white border-b-2'
              const ctaColors = ctaStyle === 'outline'
                ? { backgroundColor: 'transparent', borderColor: primaryColor, color: primaryColor }
                : ctaStyle === 'secondary'
                  ? { backgroundColor: secondaryColor, borderColor: secondaryColor }
                  : { backgroundColor: primaryColor, borderColor: primaryColor }
              return (
                <Link
                  href={navigation.ctaButton?.link || '/contact'}
                  className={cn('ml-4 flex items-center px-5 text-sm font-bold transition-all', ctaClasses)}
                  style={ctaColors}
                >
                  {navigation.ctaButton?.text}
                </Link>
              )
            })()}
          </div>
        </div>
      </nav>

      {/* MegaNav flyout */}
      <MegaNav
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        navTop={navTop}
        categoryNav={categoryNav}
        categorySettings={navigation.categoryNavigation || {}}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    </>
  )
}
