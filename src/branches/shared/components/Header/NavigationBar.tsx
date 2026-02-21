'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Header, Theme } from '@/payload-types'
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
import { CMSLink } from '../Link'

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

type Props = {
  navigation: NonNullable<Header['navigation']>
  theme: Theme | null
}

export function NavigationBar({ navigation, theme }: Props) {
  const pathname = usePathname()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const primaryColor = theme?.primaryColor || '#00897B'
  const secondaryColor = theme?.secondaryColor || '#0A1628'

  // Build navigation items based on mode
  const navItems = navigation.mode === 'manual' || navigation.mode === 'hybrid'
    ? navigation.items || []
    : []

  const specialItems = navigation.specialItems || []

  // Split special items by position
  const startItems = specialItems.filter(item => item.position === 'start')
  const endItems = specialItems.filter(item => item.position === 'end')

  // CTA Button
  const showCTA = navigation.ctaButton?.show && navigation.ctaButton?.text

  return (
    <>
      <nav className="hidden lg:block bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="flex items-stretch h-12">
            {/* Menu Trigger Button */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={cn(
                'flex items-center gap-2 px-5 text-sm font-bold transition-all border-b-2',
                megaMenuOpen
                  ? 'border-[var(--primary,#00897B)] bg-[var(--primary,#00897B)] text-white'
                  : 'text-[var(--secondary,#0A1628)] border-transparent hover:text-[var(--primary,#00897B)] hover:border-[var(--primary,#00897B)]'
              )}
              style={megaMenuOpen ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            >
              <Menu className="w-4 h-4" />
              Menu
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', megaMenuOpen && 'rotate-180')} />
            </button>

            {/* Start Special Items */}
            {startItems.map((item, index) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <Link
                  key={`start-${index}`}
                  href={item.url || '#'}
                  className={cn(
                    'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                    item.highlight
                      ? 'text-[#FF6B6B] hover:border-[#FF6B6B]'
                      : 'text-[var(--secondary,#0A1628)] hover:text-[var(--primary,#00897B)] hover:border-[var(--primary,#00897B)]'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}

            {/* Manual/Hybrid Navigation Items */}
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const Icon = item.icon ? iconMap[item.icon] : null
              const isActive = item.type === 'page' && item.page
                ? typeof item.page === 'object' && 'slug' in item.page && pathname.includes(item.page.slug as string)
                : item.url && item.url !== '/' && pathname.includes(item.url)

              return (
                <div key={item.id} className="relative">
                  {hasChildren ? (
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-full',
                        isActive
                          ? 'text-[var(--primary,#00897B)] border-[var(--primary,#00897B)]'
                          : 'text-[var(--secondary,#0A1628)] border-transparent hover:text-[var(--primary,#00897B)] hover:border-[var(--primary,#00897B)]'
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  ) : (
                    <CMSLink
                      {...(item.type === 'page' ? { reference: item.page } : { url: item.url })}
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-12',
                        isActive
                          ? 'text-[var(--primary,#00897B)] border-[var(--primary,#00897B)]'
                          : 'text-[var(--secondary,#0A1628)] border-transparent hover:text-[var(--primary,#00897B)] hover:border-[var(--primary,#00897B)]'
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </CMSLink>
                  )}

                  {/* Simple Dropdown for children */}
                  {hasChildren && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-b-xl shadow-lg min-w-[200px] opacity-0 invisible hover:opacity-100 hover:visible transition-all">
                      {item.children!.map((child) => (
                        <CMSLink
                          key={child.id}
                          {...(typeof child.page === 'object' && 'slug' in child.page ? { reference: child.page } : {})}
                          className="block px-4 py-2 text-sm text-[var(--secondary,#0A1628)] hover:bg-gray-50 hover:text-[var(--primary,#00897B)] transition-colors first:rounded-t-xl last:rounded-b-xl"
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
            {endItems.map((item, index) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <Link
                  key={`end-${index}`}
                  href={item.url || '#'}
                  className={cn(
                    'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                    item.highlight
                      ? 'text-[#FF6B6B] hover:border-[#FF6B6B]'
                      : 'text-[var(--secondary,#0A1628)] hover:text-[var(--primary,#00897B)] hover:border-[var(--primary,#00897B)]'
                  )}
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
              <a
                href="mailto:info@example.com"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[var(--primary,#00897B)] transition-colors"
              >
                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="hidden xl:inline">info@example.com</span>
              </a>
              <div className="w-px h-4 bg-gray-200" />
              <a
                href="tel:+31201234567"
                className="flex items-center gap-1.5 text-gray-600 hover:text-[var(--primary,#00897B)] transition-colors"
              >
                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="hidden xl:inline">020 123 4567</span>
              </a>
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

      {/* Mega Menu Backdrop */}
      {megaMenuOpen && (
        <div
          className="fixed inset-0 top-[120px] bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setMegaMenuOpen(false)}
        />
      )}

      {/* Mega Menu - Placeholder for now */}
      {megaMenuOpen && (
        <div className="fixed top-[120px] left-0 right-0 bg-white border-b border-gray-200 rounded-b-2xl shadow-2xl z-35 max-w-[1320px] mx-auto">
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Mega menu wordt geladen...</p>
            <p className="text-xs mt-2">Configureer categorie navigatie in de admin panel</p>
          </div>
        </div>
      )}
    </>
  )
}
