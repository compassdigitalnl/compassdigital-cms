'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Package,
  Users,
  Search,
  Grid3x3,
  List,
  Eye,
  ShoppingCart,
  MoreVertical,
  Plus,
  Upload,
  Pin,
  Clock,
  Repeat,
  Stethoscope,
  FlaskConical,
  PlusCircle,
  Building2,
  Copy,
  Trash2,
} from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { OrderListsTemplateProps, OrderList } from './types'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'clipboard-list': ClipboardList,
  repeat: Repeat,
  stethoscope: Stethoscope,
  'flask-conical': FlaskConical,
  'plus-circle': PlusCircle,
  'building-2': Building2,
  package: Package,
}

const colorMap = {
  teal: { bg: 'var(--color-primary-glow)', color: 'var(--color-primary)' },
  blue: { bg: '#E3F2FD', color: '#2196F3' },
  amber: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  green: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
}

function calculateListTotal(list: OrderList): number {
  return list.items.reduce(
    (sum, item) => sum + item.product.price * item.defaultQuantity,
    0,
  )
}

function formatRelativeTime(date: string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diffInDays = Math.floor((now - then) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Bijgewerkt vandaag'
  if (diffInDays === 1) return 'Bijgewerkt gisteren'
  if (diffInDays < 7) return `Bijgewerkt ${diffInDays} dagen geleden`
  if (diffInDays < 14) return 'Bijgewerkt vorige week'
  if (diffInDays < 30) return `Bijgewerkt ${Math.floor(diffInDays / 7)} weken geleden`
  if (diffInDays < 60) return 'Bijgewerkt vorige maand'
  return `Bijgewerkt ${Math.floor(diffInDays / 30)} maanden geleden`
}

function renderIcon(iconName: string, color: string) {
  const IconComponent = (iconMap[iconName] || ClipboardList) as any
  const colorStyle = colorMap[color as keyof typeof colorMap] || colorMap.teal

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: colorStyle.bg }}
    >
      <IconComponent className="w-5 h-5" style={{ color: colorStyle.color }} />
    </div>
  )
}

export default function OrderListsTemplate({ lists, loading, error, onRetry, onAddToCart, onDeleteList, onDuplicateList, onTogglePin }: OrderListsTemplateProps) {
  const { formatPriceStr } = usePriceMode()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('updated')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const stats = {
    activeLists: lists.length,
    totalProducts: lists.reduce((sum, list) => sum + list.itemCount, 0),
    sharedLists: lists.filter((list) => list.shareWith.length > 0).length,
  }

  const filteredAndSortedLists = useMemo(() => {
    let result = [...lists]

    if (searchQuery) {
      result = result.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'products':
          return b.itemCount - a.itemCount
        case 'value':
          return calculateListTotal(b) - calculateListTotal(a)
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return result
  }, [lists, searchQuery, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p style={{ fontSize: '14px', color: 'var(--color-grey-mid)' }}>Bestellijsten laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'var(--color-error-light)', border: '1px solid var(--color-error)' }}
      >
        <p style={{ fontSize: '14px', color: 'var(--color-error)', fontWeight: 600 }}>
          Fout bij laden: {error}
        </p>
        <button
          onClick={onRetry}
          className="btn btn-danger btn-sm mt-4"
        >
          Opnieuw proberen
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1
            className="flex items-center gap-3 mb-1"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--color-secondary)',
            }}
          >
            <ClipboardList className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
            Bestellijsten
            <span style={{ fontSize: '16px', color: 'var(--color-grey-mid)', fontWeight: 500 }}>
              ({stats.activeLists})
            </span>
          </h1>
        </div>
        <div className="flex gap-2.5">
          <button
            className="btn btn-outline-neutral flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importeren
          </button>
          <Link
            href="/account/lists/new/"
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nieuwe lijst
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'white', border: '1px solid #E8ECF1' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-glow)' }}>
            <ClipboardList className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>{stats.activeLists}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>Actieve lijsten</div>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'white', border: '1px solid #E8ECF1' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-success-light)' }}>
            <Package className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>{stats.totalProducts}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>Producten totaal</div>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'white', border: '1px solid #E8ECF1' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E3F2FD' }}>
            <Users className="w-5 h-5" style={{ color: '#2196F3' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)' }}>{stats.sharedLists}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>Gedeelde lijsten</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-grey-mid)' }} />
            <input
              type="text"
              placeholder="Zoek bestellijst…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none focus:border-[var(--color-primary)]"
              style={{ background: 'white', border: '1.5px solid #E8ECF1', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', width: '240px' }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none focus:border-[var(--color-primary)]"
            style={{ background: 'white', border: '1.5px solid #E8ECF1', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--color-secondary)' }}
          >
            <option value="updated">Laatste wijziging</option>
            <option value="name-asc">Naam A-Z</option>
            <option value="name-desc">Naam Z-A</option>
            <option value="products">Meeste producten</option>
            <option value="value">Hoogste waarde</option>
          </select>
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1.5px solid #E8ECF1' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="w-9 h-9 flex items-center justify-center transition-all"
            style={{ background: viewMode === 'grid' ? 'var(--color-primary-glow)' : 'white', borderRight: '1px solid #E8ECF1' }}
          >
            <Grid3x3 className="w-4 h-4" style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-grey-mid)' }} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="w-9 h-9 flex items-center justify-center transition-all"
            style={{ background: viewMode === 'list' ? 'var(--color-primary-glow)' : 'white' }}
          >
            <List className="w-4 h-4" style={{ color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-grey-mid)' }} />
          </button>
        </div>
      </div>

      {/* Lists Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {filteredAndSortedLists.map((list) => {
          const totalValue = calculateListTotal(list)
          const displayProducts = list.items.slice(0, 4)
          const remainingCount = list.items.length - displayProducts.length

          return (
            <Link
              key={list.id}
              href={`/account/lists/${list.id}`}
              className="block rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background: 'white', border: '1.5px solid #E8ECF1', boxShadow: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-glow)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8ECF1'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div className="flex items-start gap-3.5 mb-4">
                {renderIcon(list.icon, list.color)}
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '17px', color: 'var(--color-secondary)' }}>
                    {list.name}
                  </div>
                  <div className="flex gap-3 flex-wrap" style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" />{list.itemCount} producten</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRelativeTime(list.updatedAt)}</span>
                  </div>
                  {(list.isPinned || list.shareWith.length > 0) && (
                    <div className="flex gap-1.5 mt-1.5">
                      {list.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)', fontSize: '11px', fontWeight: 600 }}>
                          <Pin className="w-2.5 h-2.5" />Vastgepind
                        </span>
                      )}
                      {list.shareWith.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#E3F2FD', color: '#2196F3', fontSize: '11px', fontWeight: 600 }}>
                          <Users className="w-2.5 h-2.5" />Gedeeld ({list.shareWith.length})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative" ref={openDropdown === list.id ? dropdownRef : undefined}>
                  <button
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === list.id ? null : list.id) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glow)]"
                    style={{ background: 'white', border: '1px solid #E8ECF1' }}
                  >
                    <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-grey-mid)' }} />
                  </button>
                  {openDropdown === list.id && (
                    <div
                      className="absolute right-0 top-10 z-50 rounded-xl py-1.5 min-w-[180px]"
                      style={{ background: 'white', border: '1px solid #E8ECF1', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
                    >
                      <button
                        onClick={(e) => { e.preventDefault(); setOpenDropdown(null); window.location.href = `/account/lists/${list.id}` }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all hover:bg-gray-50"
                        style={{ fontSize: '13px', color: 'var(--color-secondary)' }}
                      >
                        <Eye className="w-4 h-4" style={{ color: 'var(--color-grey-mid)' }} />
                        Bekijken
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setOpenDropdown(null); onDuplicateList?.(list.id) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all hover:bg-gray-50"
                        style={{ fontSize: '13px', color: 'var(--color-secondary)' }}
                      >
                        <Copy className="w-4 h-4" style={{ color: 'var(--color-grey-mid)' }} />
                        Dupliceren
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setOpenDropdown(null); onTogglePin?.(list.id) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all hover:bg-gray-50"
                        style={{ fontSize: '13px', color: 'var(--color-secondary)' }}
                      >
                        <Pin className="w-4 h-4" style={{ color: 'var(--color-grey-mid)' }} />
                        {list.isPinned ? 'Losmaken' : 'Vastpinnen'}
                      </button>
                      <div style={{ borderTop: '1px solid #E8ECF1', margin: '4px 0' }} />
                      <button
                        onClick={(e) => { e.preventDefault(); setOpenDropdown(null); onDeleteList?.(list.id) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all hover:bg-coral-50"
                        style={{ fontSize: '13px', color: 'var(--color-error)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Verwijderen
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {displayProducts.map((item) => (
                  <div key={item.id} className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F5F7FA', border: '1px solid #E8ECF1' }}>
                    {item.product.emoji || '📦'}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ background: '#F5F7FA', border: '1px solid #E8ECF1', fontSize: '12px', color: 'var(--color-grey-mid)' }}>
                    +{remainingCount}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #E8ECF1' }}>
                <div style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>
                  Waarde:{' '}
                  <strong style={{ color: 'var(--color-secondary)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '16px', fontWeight: 800 }}>
                    €{formatPriceStr(totalValue)}
                  </strong>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); window.location.href = `/account/lists/${list.id}` }}
                    className="btn btn-outline-neutral btn-sm"
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1.5" />Bekijk
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); onAddToCart(list.id, list.name) }}
                    className="btn btn-primary btn-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 inline mr-1.5" />Bestel alles
                  </button>
                </div>
              </div>
            </Link>
          )
        })}

        {/* New List Card */}
        <Link
          href="/account/lists/new/"
          className="flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glow)]"
          style={{ background: '#F5F7FA', border: '2px dashed #E8ECF1', minHeight: '200px' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'white', border: '1.5px solid #E8ECF1' }}>
            <Plus className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '16px', color: 'var(--color-secondary)' }}>
            Nieuwe bestellijst
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-grey-mid)' }}>
            Maak een lijst per afdeling, locatie of doel
          </div>
        </Link>
      </div>

      {/* Empty State */}
      {filteredAndSortedLists.length === 0 && !loading && (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-primary-glow)' }}>
            <ClipboardList className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="font-extrabold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '18px', color: 'var(--color-secondary)' }}>
            {searchQuery ? 'Geen bestellijsten gevonden' : 'Nog geen bestellijsten'}
          </h3>
          <p className="mb-5" style={{ fontSize: '14px', color: 'var(--color-grey-mid)' }}>
            {searchQuery
              ? `Geen resultaten voor "${searchQuery}"`
              : 'Maak een bestellijst aan om producten te groeperen voor snelle herhaalbestellingen.'}
          </p>
          {!searchQuery && (
            <Link
              href="/account/lists/new/"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Maak je eerste lijst
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
