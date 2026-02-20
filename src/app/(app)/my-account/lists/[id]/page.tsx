'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Repeat,
  Package,
  User,
  Clock,
  Pin,
  Users,
  Share2,
  Copy,
  Download,
  Settings,
  Printer,
  ShoppingCart,
  PlusCircle,
  Search,
  ScanLine,
  CheckSquare,
  Move,
  Edit3,
  Trash2,
  X,
  GripVertical,
  Plus,
  Minus,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Euro,
  FileText,
  Stethoscope,
  FlaskConical,
  Building2,
  ClipboardList,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string
  name: string
  brand: string
  sku: string
  emoji?: string
  price: number
  priceUnit: string
  size?: string
  stockCount: number
}

interface OrderListItem {
  id: string
  product: Product
  quantity: number
  notes?: string
}

interface OrderList {
  id: string
  name: string
  icon: string
  color: string
  isPinned: boolean
  items: OrderListItem[]
  shareWith: Array<{ user: string; canEdit: boolean }>
  notes?: string
  updatedAt: string
  createdAt: string
  createdBy: string
}

interface QuickAddProduct {
  id: string
  name: string
  brand: string
  sku: string
  emoji: string
  price: number
  stockCount: number
}

// ============================================================================
// CONSTANTS
// ============================================================================

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

// Plastimed color scheme
const colorMap = {
  teal: { bg: 'rgba(0,137,123,0.15)', color: '#00897B' },
  blue: { bg: '#E3F2FD', color: '#2196F3' },
  amber: { bg: '#FFF8E1', color: '#F59E0B' },
  green: { bg: '#E8F5E9', color: '#00C853' },
}

const COLORS = {
  navy: '#0A1628',
  navyLight: '#121F33',
  teal: '#00897B',
  tealLight: '#26A69A',
  tealGlow: 'rgba(0,137,123,0.15)',
  white: '#FAFBFC',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  greyDark: '#64748B',
  green: '#00C853',
  greenLight: '#E8F5E9',
  coral: '#FF6B6B',
  coralLight: '#FFF0F0',
  amber: '#F59E0B',
  amberLight: '#FFF8E1',
  blue: '#2196F3',
  blueLight: '#E3F2FD',
  bg: '#F5F7FA',
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function OrderListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listId = params?.id as string

  // State
  const [list, setList] = useState<OrderList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI State
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [tableFilter, setTableFilter] = useState('')
  const [sortBy, setSortBy] = useState('manual')
  const [quickAddQuery, setQuickAddQuery] = useState('')
  const [quickAddFocused, setQuickAddFocused] = useState(false)
  const [showBulkBar, setShowBulkBar] = useState(false)

  // ============================================================================
  // FETCH DATA
  // ============================================================================

  useEffect(() => {
    fetchListDetail()
  }, [listId])

  const fetchListDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/order-lists/${listId}`)
      // if (!response.ok) throw new Error('Failed to fetch list')
      // const data = await response.json()
      // setList(data)

      // Dummy data for now
      const dummyList: OrderList = {
        id: listId,
        name: 'Wekelijkse voorraad',
        icon: 'repeat',
        color: 'teal',
        isPinned: true,
        shareWith: [
          { user: 'user1', canEdit: true },
          { user: 'user2', canEdit: false },
          { user: 'user3', canEdit: true },
        ],
        notes: 'Elke maandag bestellen. Controleer XL voorraad — loopt snel uit. Levervoorkeur: ochtend vóór 10:00.',
        items: [
          {
            id: '1',
            product: {
              id: 'p1',
              name: 'Peha-soft Nitrile Fino Handschoenen',
              brand: 'Hartmann',
              sku: 'Art. 942210 · Doos 150 st.',
              emoji: '🧤',
              price: 8.25,
              priceUnit: 'staffelprijs',
              size: 'M',
              stockCount: 512,
            },
            quantity: 5,
          },
          {
            id: '2',
            product: {
              id: 'p2',
              name: 'Peha-soft Nitrile Fino Handschoenen',
              brand: 'Hartmann',
              sku: 'Art. 942210 · Doos 150 st.',
              emoji: '🧤',
              price: 8.25,
              priceUnit: 'staffelprijs',
              size: 'L',
              stockCount: 287,
            },
            quantity: 3,
          },
          {
            id: '3',
            product: {
              id: 'p3',
              name: 'Baktolan Protect+ Pure Handcrème 100ml',
              brand: 'Hartmann',
              sku: 'Art. 232451',
              emoji: '🧴',
              price: 5.95,
              priceUnit: 'per stuk',
              stockCount: 89,
            },
            quantity: 2,
          },
          {
            id: '4',
            product: {
              id: 'p4',
              name: 'Discardit II Injectiespuit 10ml',
              brand: 'BD',
              sku: 'Art. 309110 · Doos 100 st.',
              emoji: '💉',
              price: 4.25,
              priceUnit: 'per doos',
              stockCount: 1240,
            },
            quantity: 2,
          },
          {
            id: '5',
            product: {
              id: 'p5',
              name: 'Leukoplast Professional Wondpleister 5m x 2,5cm',
              brand: 'BSN Medical',
              sku: 'Art. 76174',
              emoji: '🩹',
              price: 6.5,
              priceUnit: 'per stuk',
              stockCount: 342,
            },
            quantity: 3,
          },
          {
            id: '6',
            product: {
              id: 'p6',
              name: 'Peha-soft Nitrile Fino Handschoenen',
              brand: 'Hartmann',
              sku: 'Art. 942210 · Doos 150 st.',
              emoji: '🧤',
              price: 8.95,
              priceUnit: 'per doos',
              size: 'S',
              stockCount: 324,
            },
            quantity: 2,
          },
          {
            id: '7',
            product: {
              id: 'p7',
              name: 'Peha-soft Nitrile Fino Handschoenen',
              brand: 'Hartmann',
              sku: 'Art. 942210 · Doos 150 st.',
              emoji: '🧤',
              price: 8.95,
              priceUnit: 'per doos',
              size: 'XL',
              stockCount: 12,
            },
            quantity: 1,
          },
          {
            id: '8',
            product: {
              id: 'p8',
              name: 'ThermoScan 7 Oorthermometer',
              brand: 'Braun',
              sku: 'Art. 7833',
              emoji: '🌡️',
              price: 64.95,
              priceUnit: 'per stuk',
              stockCount: 45,
            },
            quantity: 1,
          },
        ],
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Jan de Vries',
      }

      setList(dummyList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const stats = React.useMemo(() => {
    if (!list) return { total: 0, inStock: 0, limited: 0, totalValue: 0 }

    const total = list.items.length
    const inStock = list.items.filter((item) => item.product.stockCount > 50).length
    const limited = list.items.filter((item) => item.product.stockCount <= 50).length
    const totalValue = list.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )

    return { total, inStock, limited, totalValue }
  }, [list])

  const filteredItems = React.useMemo(() => {
    if (!list) return []
    let items = [...list.items]

    // Filter by table search
    if (tableFilter) {
      items = items.filter(
        (item) =>
          item.product.name.toLowerCase().includes(tableFilter.toLowerCase()) ||
          item.product.brand.toLowerCase().includes(tableFilter.toLowerCase()) ||
          item.product.sku.toLowerCase().includes(tableFilter.toLowerCase()),
      )
    }

    // Sort
    if (sortBy === 'name-asc') {
      items.sort((a, b) => a.product.name.localeCompare(b.product.name))
    } else if (sortBy === 'price-low') {
      items.sort((a, b) => a.product.price - b.product.price)
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => b.product.price - a.product.price)
    } else if (sortBy === 'stock') {
      items.sort((a, b) => a.product.stockCount - b.product.stockCount)
    }

    return items
  }, [list, tableFilter, sortBy])

  const discount = stats.totalValue * 0.04 // 4% discount
  const expectedTotal = stats.totalValue - discount

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
    setShowBulkBar(newSelected.size > 0)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
      setShowBulkBar(false)
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)))
      setShowBulkBar(true)
    }
  }

  const handleQuantityChange = (itemId: string, delta: number) => {
    if (!list) return
    setList({
      ...list,
      items: list.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    })
  }

  const handleDeleteItem = (itemId: string) => {
    if (!list) return
    if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      setList({
        ...list,
        items: list.items.filter((item) => item.id !== itemId),
      })
    }
  }

  const handleAddToCart = (itemId: string) => {
    const item = list?.items.find((i) => i.id === itemId)
    if (item) {
      alert(`${item.quantity}x ${item.product.name} toegevoegd aan winkelwagen`)
    }
  }

  const handleAddAllToCart = () => {
    if (list) {
      alert(`Alle ${list.items.length} producten toegevoegd aan winkelwagen`)
    }
  }

  const handleBulkAction = (action: string) => {
    alert(`Bulk actie: ${action} voor ${selectedItems.size} items`)
  }

  const formatRelativeTime = (date: string): string => {
    const now = Date.now()
    const then = new Date(date).getTime()
    const diffInDays = Math.floor((now - then) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'vandaag'
    if (diffInDays === 1) return 'gisteren'
    if (diffInDays < 7) return `${diffInDays} dagen geleden`
    if (diffInDays < 14) return 'vorige week'
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weken geleden`
    if (diffInDays < 60) return 'vorige maand'
    return `${Math.floor(diffInDays / 30)} maanden geleden`
  }

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderIcon = () => {
    if (!list) return null
    const IconComponent = iconMap[list.icon] || Repeat
    const colorStyle = colorMap[list.color as keyof typeof colorMap] || colorMap.teal

    return (
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: colorStyle.bg }}
      >
        <IconComponent className="w-6 h-6" style={{ color: colorStyle.color }} />
      </div>
    )
  }

  // Dummy quick add suggestions
  const quickAddSuggestions: QuickAddProduct[] = [
    {
      id: 'qa1',
      name: 'Littmann Classic III Stethoscoop',
      brand: '3M',
      sku: 'Art. 5622',
      emoji: '🩺',
      price: 139.95,
      stockCount: 23,
    },
    {
      id: 'qa2',
      name: 'Braun ThermoScan 7 Oorthermometer',
      brand: 'Braun',
      sku: 'Art. 7833',
      emoji: '🌡️',
      price: 64.95,
      stockCount: 45,
    },
    {
      id: 'qa3',
      name: 'Peha-soft Nitrile Eco Plus — Doos 200',
      brand: 'Hartmann',
      sku: 'Art. 942215',
      emoji: '🧤',
      price: 12.5,
      stockCount: 156,
    },
  ]

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: COLORS.teal, borderTopColor: 'transparent' }}
          />
          <p style={{ fontSize: '14px', color: COLORS.greyMid }}>Bestellijst laden...</p>
        </div>
      </div>
    )
  }

  if (error || !list) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: COLORS.coralLight, border: `1px solid ${COLORS.coral}` }}
      >
        <p style={{ fontSize: '14px', color: COLORS.coral, fontWeight: 600 }}>
          {error || 'Bestellijst niet gevonden'}
        </p>
        <button
          onClick={() => router.push('/my-account/lists')}
          className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all"
          style={{
            background: COLORS.coral,
            color: 'white',
            fontSize: '13px',
          }}
        >
          Terug naar overzicht
        </button>
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div>
      {/* PAGE HEADER */}
      <div
        className="rounded-2xl p-7 mb-5"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex items-start justify-between gap-5 mb-4 flex-wrap">
          <div className="flex gap-4 items-center">
            {renderIcon()}
            <div>
              <h1
                className="mb-1"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                {list.name}
              </h1>
              <div className="flex gap-4 flex-wrap" style={{ fontSize: '13px', color: COLORS.greyMid }}>
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  {list.items.length} producten
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Aangemaakt door {list.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Laatst bijgewerkt {formatRelativeTime(list.updatedAt)}
                </span>
              </div>
              {/* Badges */}
              {(list.isPinned || list.shareWith.length > 0) && (
                <div className="flex gap-1.5 mt-1.5">
                  {list.isPinned && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                      style={{
                        background: COLORS.amberLight,
                        color: COLORS.amber,
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      <Pin className="w-3 h-3" />
                      Vastgepind
                    </span>
                  )}
                  {list.shareWith.length > 0 && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                      style={{
                        background: COLORS.blueLight,
                        color: COLORS.blue,
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      <Users className="w-3 h-3" />
                      Gedeeld met {list.shareWith.length} collega's
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
              style={{ background: 'white', border: `1.5px solid ${COLORS.grey}` }}
              title="Delen"
            >
              <Share2 className="w-4 h-4" style={{ color: COLORS.navy }} />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
              style={{ background: 'white', border: `1.5px solid ${COLORS.grey}` }}
              title="Dupliceren"
            >
              <Copy className="w-4 h-4" style={{ color: COLORS.navy }} />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
              style={{ background: 'white', border: `1.5px solid ${COLORS.grey}` }}
              title="Exporteren"
            >
              <Download className="w-4 h-4" style={{ color: COLORS.navy }} />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
              style={{ background: 'white', border: `1.5px solid ${COLORS.grey}` }}
              title="Instellingen"
            >
              <Settings className="w-4 h-4" style={{ color: COLORS.navy }} />
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:border-teal-700 hover:bg-teal-50"
              style={{
                background: 'white',
                color: COLORS.navy,
                border: `1.5px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Alles in winkelwagen
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="flex gap-6 pt-4 flex-wrap"
          style={{ borderTop: `1px solid ${COLORS.grey}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.tealGlow }}
            >
              <Package className="w-4 h-4" style={{ color: COLORS.teal }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                {stats.total}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Artikelen</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.greenLight }}
            >
              <CheckCircle className="w-4 h-4" style={{ color: COLORS.green }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                {stats.inStock}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Op voorraad</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.amberLight }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: COLORS.amber }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                {stats.limited}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Beperkt</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.blueLight }}
            >
              <Euro className="w-4 h-4" style={{ color: COLORS.blue }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                €{stats.totalValue.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: COLORS.greyMid }}>Totale waarde</div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ADD SECTION */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex items-center gap-2 mb-3" style={{ fontSize: '14px', fontWeight: 700, color: COLORS.navy }}>
          <PlusCircle className="w-4 h-4" style={{ color: COLORS.teal }} />
          Product toevoegen aan lijst
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <div className="flex-1 min-w-0 relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: COLORS.greyMid }}
            />
            <input
              type="text"
              placeholder="Zoek op productnaam, artikelnummer of EAN…"
              value={quickAddQuery}
              onChange={(e) => setQuickAddQuery(e.target.value)}
              onFocus={() => setQuickAddFocused(true)}
              onBlur={() => setTimeout(() => setQuickAddFocused(false), 200)}
              className="w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none"
              style={{
                background: COLORS.bg,
                border: `2px solid ${quickAddFocused ? COLORS.teal : COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                boxShadow: quickAddFocused ? `0 0 0 4px ${COLORS.tealGlow}` : 'none',
              }}
            />

            {/* Dropdown */}
            {quickAddFocused && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'white',
                  border: `1.5px solid ${COLORS.grey}`,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: COLORS.greyMid,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: COLORS.bg,
                    borderBottom: `1px solid ${COLORS.grey}`,
                  }}
                >
                  Suggesties
                </div>
                {quickAddSuggestions.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => alert(`${product.name} toegevoegd!`)}
                    className="flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-all hover:bg-teal-50"
                    style={{
                      borderBottom: idx < quickAddSuggestions.length - 1 ? `1px solid ${COLORS.grey}` : 'none',
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: COLORS.bg }}
                    >
                      {product.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold truncate"
                        style={{ fontSize: '14px', color: COLORS.navy }}
                      >
                        {product.name}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.greyMid }}>
                        {product.sku} · {product.brand} · Op voorraad
                      </div>
                    </div>
                    <div
                      className="flex-shrink-0"
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '15px',
                        fontWeight: 800,
                        color: COLORS.navy,
                      }}
                    >
                      €{product.price.toFixed(2)}
                    </div>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-navy-900"
                      style={{ background: COLORS.teal, color: 'white' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="flex items-center" style={{ fontSize: '13px', color: COLORS.greyMid, fontWeight: 500 }}>
            of
          </span>
          <button
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold transition-all hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
            style={{
              background: 'white',
              border: `1.5px solid ${COLORS.grey}`,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: COLORS.navy,
              whiteSpace: 'nowrap',
            }}
          >
            <ScanLine className="w-4 h-4" />
            Scan barcode
          </button>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {showBulkBar && (
        <div
          className="rounded-xl p-3.5 flex items-center gap-4 mb-4 flex-wrap"
          style={{ background: COLORS.navy, color: 'white' }}
        >
          <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600 }}>
            <CheckSquare className="w-4 h-4" style={{ color: COLORS.tealLight }} />
            <strong style={{ color: COLORS.tealLight }}>{selectedItems.size}</strong> artikelen geselecteerd
          </div>
          <div className="flex gap-2 ml-auto flex-wrap">
            <button
              onClick={() => handleBulkAction('add-to-cart')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              In winkelwagen
            </button>
            <button
              onClick={() => handleBulkAction('copy')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Copy className="w-3.5 h-3.5" />
              Kopieer naar lijst
            </button>
            <button
              onClick={() => handleBulkAction('move')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Move className="w-3.5 h-3.5" />
              Verplaats naar lijst
            </button>
            <button
              onClick={() => handleBulkAction('change-qty')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Aantal wijzigen
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: `1px solid ${COLORS.coral}`,
                background: 'rgba(255,107,107,0.1)',
                color: COLORS.coral,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Verwijderen
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedItems(new Set())
              setShowBulkBar(false)
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PRODUCT TABLE */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        {/* Table Toolbar */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4 flex-wrap"
          style={{ borderBottom: `1px solid ${COLORS.grey}` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                onClick={handleSelectAll}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all hover:border-teal-700 ${
                  selectedItems.size === filteredItems.length
                    ? 'bg-teal-700 border-teal-700'
                    : selectedItems.size > 0
                      ? 'bg-teal-700 border-teal-700'
                      : 'border-gray-300'
                }`}
              >
                {selectedItems.size === filteredItems.length ? (
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>
                ) : selectedItems.size > 0 ? (
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>–</span>
                ) : null}
              </div>
              <span
                className="cursor-pointer"
                onClick={handleSelectAll}
                style={{ fontSize: '13px', color: COLORS.greyMid }}
              >
                Alles selecteren
              </span>
            </div>

            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: COLORS.greyMid }}
              />
              <input
                type="text"
                placeholder="Filter in lijst…"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg transition-all focus:outline-none focus:border-teal-700"
                style={{
                  border: `1.5px solid ${COLORS.grey}`,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  width: '200px',
                }}
              />
            </div>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg font-semibold cursor-pointer transition-all focus:outline-none focus:border-teal-700"
              style={{
                border: `1.5px solid ${COLORS.grey}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: COLORS.navy,
                background: 'white',
              }}
            >
              <option value="manual">Volgorde: handmatig</option>
              <option value="name-asc">Naam A-Z</option>
              <option value="price-low">Prijs: laag → hoog</option>
              <option value="price-high">Prijs: hoog → laag</option>
              <option value="stock">Voorraad</option>
            </select>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                <th style={{ width: '30px', padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}></th>
                <th style={{ width: '24px', padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}></th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Product</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Maat</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Stukprijs</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Aantal</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Totaal</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}>Voorraad</th>
                <th style={{ width: '80px', padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.greyMid, borderBottom: `1px solid ${COLORS.grey}` }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => {
                const isSelected = selectedItems.has(item.id)
                const isLowStock = item.product.stockCount <= 50
                const lineTotal = item.product.price * item.quantity

                return (
                  <tr
                    key={item.id}
                    className="transition-all"
                    style={{
                      background: isSelected ? COLORS.tealGlow : 'white',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(0,137,123,0.015)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div className="cursor-grab active:cursor-grabbing" style={{ color: COLORS.greyMid }}>
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div
                        onClick={() => handleSelectItem(item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all hover:border-teal-700 ${
                          isSelected ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                          style={{ background: COLORS.bg, border: `1px solid ${COLORS.grey}` }}
                        >
                          {item.product.emoji || '📦'}
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-xs font-bold uppercase"
                            style={{ color: COLORS.teal, letterSpacing: '0.05em' }}
                          >
                            {item.product.brand}
                          </div>
                          <div
                            className="font-semibold truncate"
                            style={{ fontSize: '14px', color: COLORS.navy, maxWidth: '260px' }}
                          >
                            {item.product.name}
                          </div>
                          <div
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '11px',
                              color: COLORS.greyMid,
                            }}
                          >
                            {item.product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.navy }}>
                        {item.product.size || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div>
                        <div
                          style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: '15px',
                            fontWeight: 800,
                            color: COLORS.navy,
                          }}
                        >
                          €{item.product.price.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '11px', color: COLORS.greyMid }}>
                          {item.product.priceUnit}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div
                        className="inline-flex rounded-lg overflow-hidden"
                        style={{ border: `1.5px solid ${COLORS.grey}` }}
                      >
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-9 flex items-center justify-center transition-all hover:bg-teal-50 hover:text-teal-700"
                          style={{ background: COLORS.bg, color: COLORS.navy, fontSize: '14px', border: 'none' }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1
                            handleQuantityChange(item.id, newQty - item.quantity)
                          }}
                          className="w-10 h-9 text-center font-semibold"
                          style={{
                            border: 'none',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '14px',
                            color: COLORS.navy,
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-9 flex items-center justify-center transition-all hover:bg-teal-50 hover:text-teal-700"
                          style={{ background: COLORS.bg, color: COLORS.navy, fontSize: '14px', border: 'none' }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <span
                        style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '15px',
                          fontWeight: 800,
                          color: COLORS.navy,
                        }}
                      >
                        €{lineTotal.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div
                        className="flex items-center gap-1"
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: isLowStock ? COLORS.amber : COLORS.green,
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: isLowStock ? COLORS.amber : COLORS.green }}
                        />
                        {item.product.stockCount.toLocaleString('nl-NL')}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: idx < filteredItems.length - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="w-8 h-8 rounded-md flex items-center justify-center transition-all hover:border-teal-700 hover:bg-teal-50"
                          style={{
                            background: 'white',
                            border: `1px solid ${COLORS.grey}`,
                          }}
                          title="In winkelwagen"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" style={{ color: COLORS.navy }} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-8 h-8 rounded-md flex items-center justify-center transition-all hover:border-coral-700 hover:bg-red-50"
                          style={{
                            background: 'white',
                            border: `1px solid ${COLORS.grey}`,
                          }}
                          title="Verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" style={{ color: COLORS.coral }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table - Mobile (Cards) */}
        <div className="lg:hidden divide-y" style={{ borderTop: `1px solid ${COLORS.grey}` }}>
          {filteredItems.map((item) => {
            const isSelected = selectedItems.has(item.id)
            const isLowStock = item.product.stockCount <= 50
            const lineTotal = item.product.price * item.quantity

            return (
              <div
                key={item.id}
                className="p-4"
                style={{ background: isSelected ? COLORS.tealGlow : 'white' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    onClick={() => handleSelectItem(item.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                      isSelected ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: COLORS.bg, border: `1px solid ${COLORS.grey}` }}
                  >
                    {item.product.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold uppercase"
                      style={{ color: COLORS.teal, letterSpacing: '0.05em' }}
                    >
                      {item.product.brand}
                    </div>
                    <div
                      className="font-semibold"
                      style={{ fontSize: '14px', color: COLORS.navy }}
                    >
                      {item.product.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: COLORS.greyMid,
                      }}
                    >
                      {item.product.sku}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.greyMid }}>Maat</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.navy }}>
                      {item.product.size || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.greyMid }}>Stukprijs</div>
                    <div
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: COLORS.navy,
                      }}
                    >
                      €{item.product.price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.greyMid }}>Voorraad</div>
                    <div
                      className="flex items-center gap-1"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isLowStock ? COLORS.amber : COLORS.green,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isLowStock ? COLORS.amber : COLORS.green }}
                      />
                      {item.product.stockCount.toLocaleString('nl-NL')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.greyMid }}>Totaal</div>
                    <div
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: COLORS.navy,
                      }}
                    >
                      €{lineTotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="inline-flex rounded-lg overflow-hidden flex-1"
                    style={{ border: `1.5px solid ${COLORS.grey}` }}
                  >
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-10 h-9 flex items-center justify-center transition-all"
                      style={{ background: COLORS.bg, color: COLORS.navy }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value) || 1
                        handleQuantityChange(item.id, newQty - item.quantity)
                      }}
                      className="flex-1 h-9 text-center font-semibold"
                      style={{
                        border: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '14px',
                        color: COLORS.navy,
                      }}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-10 h-9 flex items-center justify-center transition-all"
                      style={{ background: COLORS.bg, color: COLORS.navy }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: COLORS.teal,
                      color: 'white',
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: COLORS.coralLight,
                      color: COLORS.coral,
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SUMMARY */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between gap-5 mb-5 flex-wrap"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex gap-8 flex-wrap">
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Artikelen
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              {list.items.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Totale waarde
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              €{stats.totalValue.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Staffelkorting
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.green,
              }}
            >
              − €{discount.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: COLORS.greyMid, marginBottom: '2px' }}>
              Verwachte totaal
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: COLORS.navy,
              }}
            >
              €{expectedTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:border-teal-700 hover:bg-teal-50"
            style={{
              background: 'white',
              color: COLORS.navy,
              border: `1.5px solid ${COLORS.grey}`,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            <FileText className="w-4 h-4" />
            Offerte aanvragen
          </button>
          <button
            onClick={handleAddAllToCart}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,137,123,0.3)',
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Alles in winkelwagen
          </button>
        </div>
      </div>

      {/* NOTES */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'white', border: `1px solid ${COLORS.grey}` }}
      >
        <div className="flex items-center gap-2 mb-2.5" style={{ fontSize: '14px', fontWeight: 700, color: COLORS.navy }}>
          <MessageSquare className="w-4 h-4" style={{ color: COLORS.teal }} />
          Notities bij deze lijst
        </div>
        <textarea
          defaultValue={list.notes}
          placeholder="Bijv. instructies voor collega's, bestelmomenten, leveringsvoorkeuren…"
          className="w-full px-3.5 py-3 rounded-xl resize-vertical transition-all focus:outline-none"
          style={{
            border: `1.5px solid ${COLORS.grey}`,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            color: COLORS.navy,
            minHeight: '60px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.teal
            e.target.style.boxShadow = `0 0 0 3px ${COLORS.tealGlow}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.grey
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
    </div>
  )
}
