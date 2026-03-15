'use client'

import React from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Package,
  Tag,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/utilities/cn'
import type { MegaNavProps } from './types'

export function MegaNav({
  isOpen,
  onClose,
  navTop,
  categoryNav,
  categorySettings,
  primaryColor,
  secondaryColor,
}: MegaNavProps) {
  const showIcons = categorySettings?.showCategoryIcons !== false
  const showCount = categorySettings?.showProductCount !== false
  const maxCats = categorySettings?.maxCategories || 12
  const {
    rootCategories,
    l2Categories,
    l3Categories,
    activeL1,
    activeL2,
    loading,
    error,
    handleL1Select,
    handleL2Select,
  } = categoryNav

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        style={{ top: `${navTop}px` }}
        onClick={onClose}
      />

      {/* Flyout Panel */}
      <div className="fixed left-0 right-0 z-[60]" style={{ top: `${navTop}px` }}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
          <div
            className="flex bg-white rounded-b-2xl shadow-2xl overflow-hidden min-h-[520px] border-t-2"
            style={{ borderColor: primaryColor }}
          >
            {/* L1: Root Categories */}
            <div
              className="w-[260px] flex-shrink-0 border-r flex flex-col py-3"
              style={{ backgroundColor: secondaryColor, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-5 py-2 text-white/25">
                Alle categorieën
              </div>

              {loading && (
                <div className="px-5 py-4 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                    Laden...
                  </div>
                </div>
              )}

              {error && (
                <div className="px-5 py-4">
                  <div className="bg-coral/20 border border-coral/30 rounded-lg p-3 text-xs text-white">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold mb-1">Categorieën laden mislukt</div>
                        <div className="text-white/70">{error}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && rootCategories.length === 0 && (
                <div className="px-5 py-4 text-sm text-white/50">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="mb-2">Geen categorieën gevonden.</p>
                    <p className="text-xs text-white/30">
                      Maak categorieën aan in het CMS:
                    </p>
                    <p className="text-xs text-white/20 mt-1">
                      Product Categorieën &rarr; Nieuwe Categorie
                    </p>
                  </div>
                </div>
              )}

              {!loading &&
                !error &&
                rootCategories.slice(0, maxCats).map((cat) => (
                  <button
                    key={cat.id}
                    onMouseEnter={() => handleL1Select(cat.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-all text-left group',
                      activeL1 === cat.id ? 'text-white' : 'text-white/70 hover:text-white',
                    )}
                    style={
                      activeL1 === cat.id
                        ? { backgroundColor: 'var(--color-primary-glow)' }
                        : {}
                    }
                    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                      if (activeL1 !== cat.id)
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)'
                    }}
                    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                      if (activeL1 !== cat.id)
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {showIcons && (
                      <Package
                        className="w-[17px] h-[17px] flex-shrink-0"
                        style={{
                          color:
                            activeL1 === cat.id ? primaryColor : 'rgba(255,255,255,0.35)',
                        }}
                      />
                    )}
                    {cat.name}
                    {showCount && cat.productCount && (
                      <span className="ml-auto text-[11px] text-white/20 group-hover:opacity-0 transition-opacity">
                        {cat.productCount}
                      </span>
                    )}
                    <ChevronRight
                      className={cn(
                        'w-[14px] h-[14px] ml-auto opacity-0 transition-opacity',
                        activeL1 === cat.id && 'opacity-100',
                      )}
                      style={{ color: primaryColor }}
                    />
                  </button>
                ))}
            </div>

            {/* L2: Subcategories */}
            <div
              className="w-[280px] flex-shrink-0 border-r flex flex-col py-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {l2Categories.length > 0 ? (
                <>
                  <div
                    className="flex items-center gap-2.5 px-5 py-2 mb-1 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div
                      className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary-glow)' }}
                    >
                      <Package className="w-[17px] h-[17px]" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {rootCategories.find((c) => c.id === activeL1)?.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {l2Categories.length} subcategorieën
                      </div>
                    </div>
                  </div>
                  {l2Categories.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => handleL2Select(cat.id)}
                      className={cn(
                        'flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-all text-left group',
                        activeL2 === cat.id ? '' : 'text-grey-dark',
                      )}
                      style={
                        activeL2 === cat.id
                          ? { backgroundColor: 'var(--color-primary-glow)', color: primaryColor }
                          : {}
                      }
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (activeL2 !== cat.id) {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)'
                          e.currentTarget.style.color = primaryColor
                        }
                      }}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (activeL2 !== cat.id) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'var(--color-text-primary)'
                        }
                      }}
                    >
                      <Tag
                        className="w-[17px] h-[17px] flex-shrink-0"
                        style={{
                          color: activeL2 === cat.id ? primaryColor : 'var(--color-text-muted)',
                        }}
                      />
                      {cat.name}
                      {showCount && cat.productCount && (
                        <span className="ml-auto text-[11px] text-grey-mid group-hover:opacity-0 transition-opacity">
                          {cat.productCount}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          'w-[14px] h-[14px] ml-auto opacity-0 transition-opacity',
                          activeL2 === cat.id && 'opacity-100',
                        )}
                        style={{ color: primaryColor }}
                      />
                    </button>
                  ))}
                  <Link
                    href={`/shop/${rootCategories.find((c) => c.id === activeL1)?.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold mt-1 transition-all hover:px-6"
                    style={{ color: primaryColor }}
                  >
                    <ArrowRight className="w-[14px] h-[14px]" />
                    Alles bekijken
                  </Link>
                </>
              ) : (
                <div className="px-5 py-4 text-sm text-grey-mid">Geen subcategorieën</div>
              )}
            </div>

            {/* L3: Sub-subcategories (Grid) */}
            <div className="flex-1 min-w-[340px] flex flex-col p-5">
              {l3Categories.length > 0 ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-grey-mid mb-3">
                    {rootCategories.find((c) => c.id === activeL1)?.name}
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-navy">
                      {l2Categories.find((c) => c.id === activeL2)?.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                    {l3Categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-grey-dark transition-all rounded-lg"
                        style={{ color: 'var(--color-text-primary)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)'
                          e.currentTarget.style.color = primaryColor
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'var(--color-text-primary)'
                        }}
                      >
                        <ChevronRight className="w-[17px] h-[17px] flex-shrink-0 text-grey-mid" />
                        {cat.name}
                        {showCount && cat.productCount && (
                          <span className="ml-auto text-[11px] text-grey-mid">
                            {cat.productCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/shop/${l2Categories.find((c) => c.id === activeL2)?.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold mt-auto transition-all hover:px-5"
                    style={{ color: primaryColor }}
                  >
                    <ArrowRight className="w-[14px] h-[14px]" />
                    Alle {l2Categories.find((c) => c.id === activeL2)?.name?.toLowerCase()}
                  </Link>
                </>
              ) : (
                <div className="px-4 py-4 text-sm text-grey-mid">
                  Geen producten in deze categorie
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
