'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Phone, Mail } from 'lucide-react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { cn } from '@/utilities/cn'
import { CMSLink } from '@/branches/shared/components/common/Link'
import { MegaNav } from '@/globals/site/header/components/MegaNav'
import { ManualMegaMenu } from '@/globals/site/header/components/ManualMegaMenu'
import { SimpleDropdown } from '@/globals/site/header/components/SimpleDropdown'
import { useCategoryNavigation } from '@/globals/site/header/components/hooks/useCategoryNavigation'
import type { NavigationBarProps } from './types'

export function NavigationBar({ navigation, theme, settings }: NavigationBarProps) {
  const pathname = usePathname()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
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
      if (e.key === 'Escape' && (megaMenuOpen || openDropdownId)) {
        setMegaMenuOpen(false)
        setOpenDropdownId(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [megaMenuOpen, openDropdownId])

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
                onClick={() => {
                  setMegaMenuOpen(!megaMenuOpen)
                  setOpenDropdownId(null)
                }}
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

              const isDropdownOpen = openDropdownId === item.id

              return (
                <div key={item.id} className="relative">
                  {hasDropdown ? (
                    <button
                      onClick={() => {
                        setOpenDropdownId(isDropdownOpen ? null : item.id)
                        setMegaMenuOpen(false)
                      }}
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-full',
                        isActive || isDropdownOpen
                          ? 'border-[var(--color-primary)]'
                          : 'border-transparent hover:border-[var(--color-primary)]',
                      )}
                      style={{
                        color: isActive || isDropdownOpen ? 'var(--color-primary)' : 'var(--color-secondary)',
                      }}
                    >
                      {item.icon && <Icon name={item.icon} size={16} />}
                      {item.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 opacity-40 transition-transform', isDropdownOpen && 'rotate-180')} />
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
                    <ManualMegaMenu
                      columns={item.megaColumns}
                      isOpen={isDropdownOpen}
                      onClose={() => setOpenDropdownId(null)}
                      navTop={navTop}
                      parentLabel={item.label}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    />
                  )}

                  {/* Simple Dropdown for subItems */}
                  {hasChildren && !isMega && (
                    <SimpleDropdown
                      items={subItems}
                      isOpen={isDropdownOpen}
                      onClose={() => setOpenDropdownId(null)}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    />
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
