'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'
import OrderListDetailTemplate from '@/branches/ecommerce/templates/account/OrderListDetailTemplate'
import type { OrderList, QuickAddProduct } from '@/branches/ecommerce/templates/account/OrderListDetailTemplate/types'

// ============================================================================
// COLORS (for loading/error states)
// ============================================================================

const COLORS = {
  teal: '#00897B',
  tealGlow: 'rgba(0,137,123,0.15)',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  coral: '#FF6B6B',
  coralLight: '#FFF0F0',
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function OrderListDetailPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const params = useParams()
  const router = useRouter()
  const listId = params?.id as string

  // Data state
  const [list, setList] = useState<OrderList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [tableFilter, setTableFilter] = useState('')
  const [sortBy, setSortBy] = useState('manual')
  const [quickAddQuery, setQuickAddQuery] = useState('')
  const [quickAddFocused, setQuickAddFocused] = useState(false)
  const [showBulkBar, setShowBulkBar] = useState(false)
  const [quickAddResults, setQuickAddResults] = useState<QuickAddProduct[]>([])
  const [quickAddLoading, setQuickAddLoading] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  // ============================================================================
  // FETCH DATA
  // ============================================================================

  useEffect(() => {
    fetchListDetail()
  }, [listId])

  // Debounced product search
  useEffect(() => {
    if (quickAddQuery.length < 2) {
      setQuickAddResults([])
      return
    }

    const debounceTimer = setTimeout(async () => {
      setQuickAddLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(quickAddQuery)}&limit=10`)
        if (!response.ok) throw new Error('Failed to search products')
        const data = await response.json()
        setQuickAddResults(data.docs || [])
      } catch (err) {
        console.error('Error searching products:', err)
        setQuickAddResults([])
      } finally {
        setQuickAddLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [quickAddQuery])

  const fetchListDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/order-lists/${listId}`)

      if (response.status === 401) {
        const currentPath = window.location.pathname
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
        return
      }

      if (!response.ok) throw new Error('Failed to fetch list')
      const data = await response.json()

      const mapped: OrderList = {
        ...data.doc,
        items: data.doc.items?.map((item: any) => ({
          ...item,
          quantity: item.defaultQuantity || item.quantity || 1,
        })) || [],
      }

      setList(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const stats = React.useMemo(() => {
    if (!list) return { total: 0, inStock: 0, limited: 0, totalValue: 0 }
    const total = list.items.length
    const inStock = list.items.filter((item) => item.product.stockCount > 50).length
    const limited = list.items.filter((item) => item.product.stockCount <= 50).length
    const totalValue = list.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return { total, inStock, limited, totalValue }
  }, [list])

  const filteredItems = React.useMemo(() => {
    if (!list) return []
    let items = [...list.items]

    if (tableFilter) {
      items = items.filter(
        (item) =>
          item.product.name.toLowerCase().includes(tableFilter.toLowerCase()) ||
          item.product.brand.toLowerCase().includes(tableFilter.toLowerCase()) ||
          item.product.sku.toLowerCase().includes(tableFilter.toLowerCase()),
      )
    }

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

  const discount = stats.totalValue * 0.04
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

  const handleQuantityChange = async (itemId: string, delta: number) => {
    if (!list) return

    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
    )

    setList({ ...list, items: updatedItems })

    try {
      const itemsForAPI = updatedItems.map((item) => ({
        ...item,
        defaultQuantity: item.quantity,
      }))
      const response = await fetch(`/api/order-lists/${list.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsForAPI }),
      })
      if (!response.ok) throw new Error('Failed to update list')
    } catch (err) {
      console.error('Failed to save quantity change:', err)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!list) return
    if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      const updatedItems = list.items.filter((item) => item.id !== itemId)
      setList({ ...list, items: updatedItems })

      try {
        const itemsForAPI = updatedItems.map((item) => ({
          ...item,
          defaultQuantity: item.quantity,
        }))
        const response = await fetch(`/api/order-lists/${list.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsForAPI }),
        })
        if (!response.ok) throw new Error('Failed to update list')
      } catch (err) {
        console.error('Failed to delete item:', err)
        alert('Fout bij verwijderen product')
      }
    }
  }

  const handleAddToCart = (itemId: string) => {
    const item = list?.items.find((i) => i.id === itemId)
    if (item) {
      alert(`${item.quantity}x ${item.product.name} toegevoegd aan winkelwagen`)
    }
  }

  const handleAddAllToCart = async () => {
    if (!list) return
    try {
      const response = await fetch(`/api/order-lists/${list.id}/add-to-cart`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to add to cart')
      const data = await response.json()
      alert(data.message || `Alle ${list.items.length} producten toegevoegd aan winkelwagen`)
    } catch (err) {
      alert('Fout bij toevoegen aan winkelwagen')
      console.error(err)
    }
  }

  const handleBulkAction = (action: string) => {
    alert(`Bulk actie: ${action} voor ${selectedItems.size} items`)
  }

  const handleAddProductToList = async (product: QuickAddProduct) => {
    if (!list) return

    const newItem = {
      id: `temp-${Date.now()}`,
      product: {
        id: product.id,
        name: product.title,
        brand: product.brand,
        sku: product.sku,
        emoji: '📦',
        price: product.price,
        priceUnit: 'stuk',
        size: '',
        stockCount: product.stock,
      },
      quantity: 1,
      notes: '',
    }

    const updatedItems = [...list.items, newItem]
    setList({ ...list, items: updatedItems })
    setQuickAddQuery('')
    setQuickAddFocused(false)

    try {
      const itemsForAPI = updatedItems.map((item) => ({
        product: typeof item.product === 'string' ? item.product : item.product.id,
        defaultQuantity: item.quantity,
        notes: item.notes || '',
      }))
      const response = await fetch(`/api/order-lists/${list.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsForAPI }),
      })
      if (!response.ok) throw new Error('Failed to update list')
      await fetchListDetail()
    } catch (err) {
      console.error('Failed to add product to list:', err)
      alert('Fout bij toevoegen product aan lijst')
      setList({ ...list, items: list.items })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!list || !over || active.id === over.id) return

    const oldIndex = list.items.findIndex((item) => item.id === active.id)
    const newIndex = list.items.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reorderedItems = arrayMove(list.items, oldIndex, newIndex)
    setList({ ...list, items: reorderedItems })

    try {
      const itemsForAPI = reorderedItems.map((item) => ({
        product: typeof item.product === 'string' ? item.product : item.product.id,
        defaultQuantity: item.quantity,
        notes: item.notes || '',
      }))
      const response = await fetch(`/api/order-lists/${list.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsForAPI }),
      })
      if (!response.ok) throw new Error('Failed to update list order')
    } catch (err) {
      console.error('Failed to reorder items:', err)
      alert('Fout bij herschikken producten')
      setList({ ...list, items: list.items })
    }
  }

  const handleBarcodeScan = async (barcode: string) => {
    setShowBarcodeScanner(false)
    if (!barcode) return

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(barcode)}&limit=1`)
      if (!response.ok) throw new Error('Failed to search product')
      const data = await response.json()

      if (data.docs && data.docs.length > 0) {
        const product = data.docs[0]
        await handleAddProductToList(product)
        alert(`Product "${product.title}" toegevoegd aan lijst!`)
      } else {
        alert(`Geen product gevonden met barcode: ${barcode}`)
      }
    } catch (err) {
      console.error('Error searching product by barcode:', err)
      alert('Fout bij zoeken product met barcode')
    }
  }

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
          onClick={() => router.push('/account/lists')}
          className="mt-4 px-4 py-2 rounded-lg font-semibold transition-all"
          style={{ background: COLORS.coral, color: 'white', fontSize: '13px' }}
        >
          Terug naar overzicht
        </button>
      </div>
    )
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <OrderListDetailTemplate
      list={list}
      listId={listId}
      selectedItems={selectedItems}
      showBulkBar={showBulkBar}
      tableFilter={tableFilter}
      sortBy={sortBy}
      quickAddQuery={quickAddQuery}
      quickAddFocused={quickAddFocused}
      quickAddResults={quickAddResults}
      quickAddLoading={quickAddLoading}
      showBarcodeScanner={showBarcodeScanner}
      filteredItems={filteredItems}
      stats={stats}
      discount={discount}
      expectedTotal={expectedTotal}
      onSelectItem={handleSelectItem}
      onSelectAll={handleSelectAll}
      onQuantityChange={handleQuantityChange}
      onDeleteItem={handleDeleteItem}
      onAddToCart={handleAddToCart}
      onAddAllToCart={handleAddAllToCart}
      onBulkAction={handleBulkAction}
      onClearSelection={() => { setSelectedItems(new Set()); setShowBulkBar(false) }}
      onDragEnd={handleDragEnd}
      onTableFilterChange={setTableFilter}
      onSortChange={setSortBy}
      onQuickAddQueryChange={setQuickAddQuery}
      onQuickAddFocus={() => setQuickAddFocused(true)}
      onQuickAddBlur={() => setTimeout(() => setQuickAddFocused(false), 200)}
      onAddProductToList={handleAddProductToList}
      onScanBarcode={() => setShowBarcodeScanner(true)}
      onBarcodeScan={handleBarcodeScan}
      onCloseBarcodeScanner={() => setShowBarcodeScanner(false)}
    />
  )
}
