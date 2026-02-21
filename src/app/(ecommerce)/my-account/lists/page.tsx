'use client'

import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'

// TypeScript types
interface OrderListItem {
  id: string
  product: {
    id: string
    name: string
    emoji?: string
    price: number
  }
  defaultQuantity: number
  notes?: string
}

interface OrderList {
  id: string
  name: string
  icon: string
  color: string
  isPinned: boolean
  itemCount: number
  items: OrderListItem[]
  shareWith: Array<{ user: string; canEdit: boolean }>
  updatedAt: string
  createdAt: string
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'clipboard-list': ClipboardList,
  repeat: Repeat,
  stethoscope: Stethoscope,
  'flask-conical': FlaskConical,
  'plus-circle': PlusCircle,
  'building-2': Building2,
  package: Package,
}

// Color mapping (Plastimed design colors)
const colorMap = {
  teal: { bg: 'rgba(0,137,123,0.15)', color: '#00897B' },
  blue: { bg: '#E3F2FD', color: '#2196F3' },
  amber: { bg: '#FFF8E1', color: '#F59E0B' },
  green: { bg: '#E8F5E9', color: '#00C853' },
}

export default function OrderListsPage() {
  const [lists, setLists] = useState<OrderList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('updated')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch order lists
  useEffect(() => {
    fetchOrderLists()
  }, [])

  const fetchOrderLists = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/order-lists')
      if (!response.ok) throw new Error('Failed to fetch order lists')
      const data = await response.json()
      setLists(data.docs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const stats = {
    activeLists: lists.length,
    totalProducts: lists.reduce((sum, list) => sum + list.itemCount, 0),
    sharedLists: lists.filter((list) => list.shareWith.length > 0).length,
  }

  // Filter and sort lists
  const filteredAndSortedLists = React.useMemo(() => {
    let result = [...lists]

    // Filter by search query
    if (searchQuery) {
      result = result.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort
    result.sort((a, b) => {
      // Pinned items always first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // Then by selected sort
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

  // Calculate total value of a list
  const calculateListTotal = (list: OrderList): number => {
    return list.items.reduce(
      (sum, item) => sum + item.product.price * item.defaultQuantity,
      0,
    )
  }

  // Format relative time
  const formatRelativeTime = (date: string): string => {
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

  // Render list icon
  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = iconMap[iconName] || ClipboardList
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: '#00897B', borderTopColor: 'transparent' }}
          />
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>Bestellijsten laden...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: '#FFF0F0', border: '1px solid #FF6B6B' }}
      >
        <p style={{ fontSize: '14px', color: '#FF6B6B', fontWeight: 600 }}>
          Fout bij laden: {error}
        </p>
        <button
          onClick={fetchOrderLists}
          className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all"
          style={{
            background: '#FF6B6B',
            color: 'white',
            fontSize: '13px',
          }}
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
              color: '#0A1628',
            }}
          >
            <ClipboardList className="w-7 h-7" style={{ color: '#00897B' }} />
            Bestellijsten
            <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 500 }}>
              ({stats.activeLists})
            </span>
          </h1>
        </div>
        <div className="flex gap-2.5">
          <button
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
            style={{
              background: 'white',
              color: '#0A1628',
              border: '1.5px solid #E8ECF1',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            <Upload className="w-4 h-4" />
            Importeren
          </button>
          <Link
            href="/my-account/lists/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            Nieuwe lijst
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Active Lists */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'white', border: '1px solid #E8ECF1' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,137,123,0.15)' }}
          >
            <ClipboardList className="w-5 h-5" style={{ color: '#00897B' }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '24px',
                fontWeight: 800,
                color: '#0A1628',
              }}
            >
              {stats.activeLists}
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Actieve lijsten</div>
          </div>
        </div>

        {/* Total Products */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'white', border: '1px solid #E8ECF1' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#E8F5E9' }}
          >
            <Package className="w-5 h-5" style={{ color: '#00C853' }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '24px',
                fontWeight: 800,
                color: '#0A1628',
              }}
            >
              {stats.totalProducts}
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Producten totaal</div>
          </div>
        </div>

        {/* Shared Lists */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'white', border: '1px solid #E8ECF1' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#E3F2FD' }}
          >
            <Users className="w-5 h-5" style={{ color: '#2196F3' }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '24px',
                fontWeight: 800,
                color: '#0A1628',
              }}
            >
              {stats.sharedLists}
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Gedeelde lijsten</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Zoek bestellijst…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none focus:border-teal-700"
              style={{
                background: 'white',
                border: '1.5px solid #E8ECF1',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                width: '240px',
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all focus:outline-none focus:border-teal-700"
            style={{
              background: 'white',
              border: '1.5px solid #E8ECF1',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: '#0A1628',
            }}
          >
            <option value="updated">Laatste wijziging</option>
            <option value="name-asc">Naam A-Z</option>
            <option value="name-desc">Naam Z-A</option>
            <option value="products">Meeste producten</option>
            <option value="value">Hoogste waarde</option>
          </select>
        </div>

        {/* View Toggle */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1.5px solid #E8ECF1' }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className="w-9 h-9 flex items-center justify-center transition-all"
            style={{
              background: viewMode === 'grid' ? 'rgba(0,137,123,0.15)' : 'white',
              borderRight: '1px solid #E8ECF1',
            }}
          >
            <Grid3x3
              className="w-4 h-4"
              style={{ color: viewMode === 'grid' ? '#00897B' : '#94A3B8' }}
            />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="w-9 h-9 flex items-center justify-center transition-all"
            style={{
              background: viewMode === 'list' ? 'rgba(0,137,123,0.15)' : 'white',
            }}
          >
            <List
              className="w-4 h-4"
              style={{ color: viewMode === 'list' ? '#00897B' : '#94A3B8' }}
            />
          </button>
        </div>
      </div>

      {/* Lists Grid/List */}
      <div
        className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
      >
        {filteredAndSortedLists.map((list) => {
          const totalValue = calculateListTotal(list)
          const displayProducts = list.items.slice(0, 4)
          const remainingCount = list.items.length - displayProducts.length

          return (
            <Link
              key={list.id}
              href={`/my-account/lists/${list.id}`}
              className="block rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{
                background: 'white',
                border: '1.5px solid #E8ECF1',
                boxShadow: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,137,123,0.3)'
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E8ECF1'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Card Top */}
              <div className="flex items-start gap-3.5 mb-4">
                {renderIcon(list.icon, list.color)}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-extrabold mb-0.5"
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '17px',
                      color: '#0A1628',
                    }}
                  >
                    {list.name}
                  </div>
                  <div className="flex gap-3 flex-wrap" style={{ fontSize: '13px', color: '#94A3B8' }}>
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {list.itemCount} producten
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(list.updatedAt)}
                    </span>
                  </div>
                  {/* Badges */}
                  {(list.isPinned || list.shareWith.length > 0) && (
                    <div className="flex gap-1.5 mt-1.5">
                      {list.isPinned && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                          style={{
                            background: '#FFF8E1',
                            color: '#F59E0B',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          <Pin className="w-2.5 h-2.5" />
                          Vastgepind
                        </span>
                      )}
                      {list.shareWith.length > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                          style={{
                            background: '#E3F2FD',
                            color: '#2196F3',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          <Users className="w-2.5 h-2.5" />
                          Gedeeld ({list.shareWith.length})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Open menu
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
                  style={{
                    background: 'white',
                    border: '1px solid #E8ECF1',
                  }}
                >
                  <MoreVertical className="w-4 h-4" style={{ color: '#94A3B8' }} />
                </button>
              </div>

              {/* Product Emojis */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {displayProducts.map((item) => (
                  <div
                    key={item.id}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: '#F5F7FA',
                      border: '1px solid #E8ECF1',
                    }}
                  >
                    {item.product.emoji || '📦'}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                    style={{
                      background: '#F5F7FA',
                      border: '1px solid #E8ECF1',
                      fontSize: '12px',
                      color: '#94A3B8',
                    }}
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>

              {/* Card Bottom */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid #E8ECF1' }}
              >
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Waarde:{' '}
                  <strong
                    style={{
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '16px',
                      fontWeight: 800,
                    }}
                  >
                    €{totalValue.toFixed(2)}
                  </strong>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      // Navigate to detail page
                      window.location.href = `/my-account/lists/${list.id}`
                    }}
                    className="px-3.5 py-2 rounded-lg font-semibold transition-all hover:border-teal-700 hover:text-teal-700"
                    style={{
                      background: '#F5F7FA',
                      color: '#0A1628',
                      border: '1px solid #E8ECF1',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1.5" />
                    Bekijk
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      try {
                        const response = await fetch(`/api/order-lists/${list.id}/add-to-cart`, {
                          method: 'POST',
                        })
                        if (!response.ok) throw new Error('Failed to add to cart')
                        const data = await response.json()
                        alert(data.message || `Alle producten uit "${list.name}" toegevoegd aan winkelwagen`)
                      } catch (err) {
                        alert('Fout bij toevoegen aan winkelwagen')
                        console.error(err)
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      background: '#00897B',
                      color: 'white',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      boxShadow: '0 2px 8px rgba(0,137,123,0.3)',
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 inline mr-1.5" />
                    Bestel alles
                  </button>
                </div>
              </div>
            </Link>
          )
        })}

        {/* New List Card */}
        <Link
          href="/my-account/lists/new"
          className="flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:border-teal-700 hover:bg-teal-50"
          style={{
            background: '#F5F7FA',
            border: '2px dashed #E8ECF1',
            minHeight: '200px',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'white',
              border: '1.5px solid #E8ECF1',
            }}
          >
            <Plus className="w-6 h-6" style={{ color: '#00897B' }} />
          </div>
          <div
            className="font-bold mb-1"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              color: '#0A1628',
            }}
          >
            Nieuwe bestellijst
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>
            Maak een lijst per afdeling, locatie of doel
          </div>
        </Link>
      </div>

      {/* Empty State */}
      {filteredAndSortedLists.length === 0 && !loading && (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white' }}>
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.15)' }}
          >
            <ClipboardList className="w-8 h-8" style={{ color: '#00897B' }} />
          </div>
          <h3
            className="font-extrabold mb-2"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '18px',
              color: '#0A1628',
            }}
          >
            {searchQuery ? 'Geen bestellijsten gevonden' : 'Nog geen bestellijsten'}
          </h3>
          <p className="mb-5" style={{ fontSize: '14px', color: '#94A3B8' }}>
            {searchQuery
              ? `Geen resultaten voor "${searchQuery}"`
              : 'Maak een bestellijst aan om producten te groeperen voor snelle herhaalbestellingen.'}
          </p>
          {!searchQuery && (
            <Link
              href="/my-account/lists/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
              }}
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
