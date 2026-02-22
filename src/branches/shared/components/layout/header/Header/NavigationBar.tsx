'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Header, Theme, Settings } from '@/payload-types'
import {
  Menu,
  ChevronDown,
  ChevronRight,
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
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/utilities/cn'
import { CMSLink } from '@/branches/shared/components/common/Link'

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
  settings?: Settings | null
}

type Category = {
  id: string
  name: string
  slug: string
  productCount?: number
  icon?: string
}

export function NavigationBar({ navigation, theme, settings }: Props) {
  const pathname = usePathname()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [rootCategories, setRootCategories] = useState<Category[]>([])
  const [activeL1, setActiveL1] = useState<string | null>(null)
  const [activeL2, setActiveL2] = useState<string | null>(null)
  const [l2Categories, setL2Categories] = useState<Category[]>([])
  const [l3Categories, setL3Categories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const [navTop, setNavTop] = useState(0)

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

  // Calculate nav position for fixed mega menu
  useEffect(() => {
    const updateNavPosition = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        setNavTop(rect.bottom + window.scrollY)
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
    if (megaMenuOpen && rootCategories.length === 0 && !error) {
      fetchRootCategories()
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

  async function fetchRootCategories() {
    setLoading(true)
    setError(null)
    try {
      console.log('[MegaMenu] 🔍 Fetching root categories...')
      const url = '/api/product-categories?where[parent][exists]=false&where[showInNavigation][equals]=true&where[visible][equals]=true&sort=navigationOrder&limit=10&depth=0'
      console.log('[MegaMenu] 📡 API URL:', url)

      const res = await fetch(url)
      console.log('[MegaMenu] 📨 Response status:', res.status, res.statusText)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('[MegaMenu] ❌ API Error:', errorText)
        setError(`API Error: ${res.status} ${res.statusText}`)
        return
      }

      const data = await res.json()
      console.log('[MegaMenu] 📦 Response data:', data)
      console.log('[MegaMenu] ✅ Found', data.docs?.length || 0, 'root categories')

      if (data.docs && data.docs.length > 0) {
        console.log('[MegaMenu] 📋 Categories:', data.docs.map((c: any) => c.name).join(', '))
        setRootCategories(data.docs)
        // Auto-select first category
        setActiveL1(data.docs[0].id)
        fetchL2Categories(data.docs[0].id)
      } else {
        console.warn('[MegaMenu] ⚠️ No categories found - check CMS settings')
        setError('No categories configured')
      }
    } catch (err) {
      console.error('[MegaMenu] 💥 Failed to fetch categories:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchL2Categories(parentId: string) {
    try {
      console.log('[MegaMenu] 🔍 Fetching L2 categories for parent:', parentId)
      const res = await fetch(`/api/product-categories?where[parent][equals]=${parentId}&where[visible][equals]=true&sort=order&limit=20&depth=0`)
      const data = await res.json()
      console.log('[MegaMenu] 📦 L2 categories:', data.docs?.length || 0)
      setL2Categories(data.docs || [])
      if (data.docs && data.docs.length > 0) {
        setActiveL2(data.docs[0].id)
        fetchL3Categories(data.docs[0].id)
      } else {
        setL3Categories([])
      }
    } catch (err) {
      console.error('[MegaMenu] ❌ Failed to fetch L2 categories:', err)
    }
  }

  async function fetchL3Categories(parentId: string) {
    try {
      console.log('[MegaMenu] 🔍 Fetching L3 categories for parent:', parentId)
      const res = await fetch(`/api/product-categories?where[parent][equals]=${parentId}&where[visible][equals]=true&sort=order&limit=20&depth=0`)
      const data = await res.json()
      console.log('[MegaMenu] 📦 L3 categories:', data.docs?.length || 0)
      setL3Categories(data.docs || [])
    } catch (err) {
      console.error('[MegaMenu] ❌ Failed to fetch L3 categories:', err)
    }
  }

  function handleL1Hover(categoryId: string) {
    setActiveL1(categoryId)
    fetchL2Categories(categoryId)
  }

  function handleL2Hover(categoryId: string) {
    setActiveL2(categoryId)
    fetchL3Categories(categoryId)
  }

  return (
    <>
      <nav ref={navRef} className="hidden lg:block bg-white border-b sticky top-[72px] z-[190]" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto px-8" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="flex items-stretch h-12">
            {/* Menu Trigger Button */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={cn(
                'flex items-center gap-2 px-5 text-sm font-bold transition-all border-b-2',
                megaMenuOpen
                  ? 'text-white'
                  : 'text-white'
              )}
              style={{
                backgroundColor: megaMenuOpen ? primaryColor : secondaryColor,
                borderColor: megaMenuOpen ? primaryColor : secondaryColor,
              }}
              onMouseEnter={(e) => {
                if (!megaMenuOpen) {
                  e.currentTarget.style.backgroundColor = primaryColor
                  e.currentTarget.style.borderColor = primaryColor
                }
              }}
              onMouseLeave={(e) => {
                if (!megaMenuOpen) {
                  e.currentTarget.style.backgroundColor = secondaryColor
                  e.currentTarget.style.borderColor = secondaryColor
                }
              }}
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
                      : 'hover:border-[var(--color-primary)]'
                  )}
                  style={{ color: item.highlight ? '#FF6B6B' : 'var(--color-secondary)' }}
                  onMouseEnter={(e) => {
                    if (!item.highlight) {
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.highlight) {
                      e.currentTarget.style.color = 'var(--color-secondary)'
                    }
                  }}
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
                <div key={item.id} className="relative group">
                  {hasChildren ? (
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 transition-all h-full',
                        isActive ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-[var(--color-primary)]'
                      )}
                      style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)' }}
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
                        isActive ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-[var(--color-primary)]'
                      )}
                      style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </CMSLink>
                  )}

                  {/* Simple Dropdown for children */}
                  {hasChildren && (
                    <div className="absolute top-full left-0 bg-white border rounded-b-xl shadow-lg min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[195]" style={{ borderColor: 'var(--color-border)' }}>
                      {item.children!.map((child) => (
                        <CMSLink
                          key={child.id}
                          {...(typeof child.page === 'object' && 'slug' in child.page ? { reference: child.page } : {})}
                          className="block px-4 py-2 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                          style={{ color: 'var(--color-secondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                            e.currentTarget.style.color = 'var(--color-primary)'
                          }}
                          onMouseLeave={(e) => {
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
            {endItems.map((item, index) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <Link
                  key={`end-${index}`}
                  href={item.url || '#'}
                  className={cn(
                    'flex items-center gap-2 px-4 text-sm font-semibold border-b-2 border-transparent transition-all',
                    item.highlight ? 'text-[#FF6B6B] hover:border-[#FF6B6B]' : 'hover:border-[var(--color-primary)]'
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
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                  >
                    <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                    <span className="hidden xl:inline">{settings.email}</span>
                  </a>
                  {settings?.phone && <div className="w-px h-4" style={{ backgroundColor: 'var(--color-border)' }} />}
                </>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
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

      {/* Flyout Backdrop */}
      {megaMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[180]"
          style={{ top: `${navTop}px` }}
          onClick={() => setMegaMenuOpen(false)}
        />
      )}

      {/* Flyout Mega Menu - FIXED POSITIONING */}
      {megaMenuOpen && (
        <div
          className="fixed left-0 right-0 z-[185]"
          style={{ top: `${navTop}px` }}
        >
          <div className="mx-auto px-8" style={{ maxWidth: 'var(--container-width)' }}>
            <div className="flex bg-white rounded-b-2xl shadow-2xl overflow-hidden min-h-[520px] border-t-2" style={{ borderColor: primaryColor }}>

              {/* L1: Root Categories */}
              <div className="w-[260px] flex-shrink-0 border-r flex flex-col py-3" style={{ backgroundColor: secondaryColor, borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-[10px] font-bold uppercase tracking-wider px-5 py-2 text-white/25">Alle categorieën</div>

                {loading && (
                  <div className="px-5 py-4 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                      Laden...
                    </div>
                  </div>
                )}

                {error && (
                  <div className="px-5 py-4">
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-xs text-white">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold mb-1">Categorieën laden mislukt</div>
                          <div className="text-white/70">{error}</div>
                        </div>
                      </div>
                      <div className="text-white/50 mt-2">
                        💡 Check console logs voor details
                      </div>
                    </div>
                  </div>
                )}

                {!loading && !error && rootCategories.length === 0 && (
                  <div className="px-5 py-4 text-sm text-white/50">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="mb-2">Geen categorieën gevonden.</p>
                      <p className="text-xs text-white/30">Maak categorieën aan in het CMS:</p>
                      <p className="text-xs text-white/20 mt-1">Product Categorieën → Nieuwe Categorie</p>
                    </div>
                  </div>
                )}

                {!loading && !error && rootCategories.length > 0 && rootCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onMouseEnter={() => handleL1Hover(cat.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-all text-left group',
                      activeL1 === cat.id
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    )}
                    style={activeL1 === cat.id ? { backgroundColor: 'rgba(0,137,123,0.18)' } : {}}
                    onMouseOver={(e) => {
                      if (activeL1 !== cat.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(0,137,123,0.18)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeL1 !== cat.id) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <Package className="w-[17px] h-[17px] flex-shrink-0" style={{ color: activeL1 === cat.id ? primaryColor : 'rgba(255,255,255,0.35)' }} />
                    {cat.name}
                    {cat.productCount && (
                      <span className="ml-auto text-[11px] text-white/20 group-hover:opacity-0 transition-opacity">{cat.productCount}</span>
                    )}
                    <ChevronRight className={cn('w-[14px] h-[14px] ml-auto opacity-0 transition-opacity', activeL1 === cat.id && 'opacity-100')} style={{ color: primaryColor }} />
                  </button>
                ))}
              </div>

              {/* L2: Subcategories */}
              <div className="w-[280px] flex-shrink-0 border-r flex flex-col py-3" style={{ borderColor: 'var(--color-border)' }}>
                {l2Categories.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2.5 px-5 py-2 mb-1 border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                        <Package className="w-[17px] h-[17px]" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {rootCategories.find(c => c.id === activeL1)?.name}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{l2Categories.length} subcategorieën</div>
                      </div>
                    </div>
                    {l2Categories.map((cat) => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => handleL2Hover(cat.id)}
                        className={cn(
                          'flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-all text-left group',
                          activeL2 === cat.id ? '' : 'text-gray-700'
                        )}
                        style={activeL2 === cat.id ? { backgroundColor: `${primaryColor}12`, color: primaryColor } : {}}
                        onMouseOver={(e) => {
                          if (activeL2 !== cat.id) {
                            e.currentTarget.style.backgroundColor = `${primaryColor}12`
                            e.currentTarget.style.color = primaryColor
                          }
                        }}
                        onMouseOut={(e) => {
                          if (activeL2 !== cat.id) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#374151'
                          }
                        }}
                      >
                        <Tag className="w-[17px] h-[17px] flex-shrink-0" style={{ color: activeL2 === cat.id ? primaryColor : '#9ca3af' }} />
                        {cat.name}
                        {cat.productCount && (
                          <span className="ml-auto text-[11px] text-gray-400 group-hover:opacity-0 transition-opacity">{cat.productCount}</span>
                        )}
                        <ChevronRight className={cn('w-[14px] h-[14px] ml-auto opacity-0 transition-opacity', activeL2 === cat.id && 'opacity-100')} style={{ color: primaryColor }} />
                      </button>
                    ))}
                    <Link
                      href={`/shop/${rootCategories.find(c => c.id === activeL1)?.slug}`}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold mt-1 transition-all hover:px-6"
                      style={{ color: primaryColor }}
                    >
                      <ArrowRight className="w-[14px] h-[14px]" />
                      Alles bekijken
                    </Link>
                  </>
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-400">Geen subcategorieën</div>
                )}
              </div>

              {/* L3: Sub-subcategories (Grid) */}
              <div className="flex-1 min-w-[340px] flex flex-col p-5">
                {l3Categories.length > 0 ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      {rootCategories.find(c => c.id === activeL1)?.name}
                      <ChevronRight className="w-3 h-3" />
                      <span className="font-semibold text-gray-900">
                        {l2Categories.find(c => c.id === activeL2)?.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                      {l3Categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop/${cat.slug}`}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all rounded-lg"
                          style={{ color: '#374151' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${primaryColor}12`
                            e.currentTarget.style.color = primaryColor
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#374151'
                          }}
                        >
                          <ChevronRight className="w-[17px] h-[17px] flex-shrink-0 text-gray-400" />
                          {cat.name}
                          {cat.productCount && (
                            <span className="ml-auto text-[11px] text-gray-400">{cat.productCount}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/shop/${l2Categories.find(c => c.id === activeL2)?.slug}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold mt-auto transition-all hover:px-5"
                      style={{ color: primaryColor }}
                    >
                      <ArrowRight className="w-[14px] h-[14px]" />
                      Alle {l2Categories.find(c => c.id === activeL2)?.name?.toLowerCase()}
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-400">Geen producten in deze categorie</div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
