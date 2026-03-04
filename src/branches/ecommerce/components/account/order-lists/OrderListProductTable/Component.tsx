'use client'

import React from 'react'
import {
  Search,
  GripVertical,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CheckSquare,
  Copy,
  Move,
  Edit3,
  X,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { OrderListProductTableProps, OrderListItem } from './types'

// ============================================================================
// COLORS
// ============================================================================

const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealLight: '#26A69A',
  tealGlow: 'rgba(0,137,123,0.15)',
  white: '#FAFBFC',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  greyDark: '#64748B',
  green: '#00C853',
  coral: '#FF6B6B',
  coralLight: '#FFF0F0',
  amber: '#F59E0B',
  bg: '#F5F7FA',
}

// ============================================================================
// SORTABLE ROW
// ============================================================================

interface SortableRowProps {
  item: OrderListItem
  idx: number
  totalItems: number
  isSelected: boolean
  onSelectItem: (id: string) => void
  onQuantityChange: (id: string, delta: number) => void
  onDeleteItem: (id: string) => void
  onAddToCart: (id: string) => void
}

function SortableRow({
  item,
  idx,
  totalItems,
  isSelected,
  onSelectItem,
  onQuantityChange,
  onDeleteItem,
  onAddToCart,
}: SortableRowProps) {
  const { formatPriceStr } = usePriceMode()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isLowStock = item.product.stockCount <= 50
  const lineTotal = item.product.price * item.quantity

  return (
    <tr
      ref={setNodeRef}
      style={{
        ...style,
        background: isSelected ? COLORS.tealGlow : 'white',
      }}
      className="transition-all"
      onMouseEnter={(e) => {
        if (!isSelected && !isDragging) {
          e.currentTarget.style.background = 'rgba(0,137,123,0.015)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !isDragging) {
          e.currentTarget.style.background = 'white'
        }
      }}
    >
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <div
          className="cursor-grab active:cursor-grabbing"
          style={{ color: COLORS.greyMid }}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <div
          onClick={() => onSelectItem(item.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all hover:border-teal-700 ${
            isSelected ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
          }`}
        >
          {isSelected && <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>}
        </div>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
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
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.navy }}>
          {item.product.size || '—'}
        </span>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <div>
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 800,
              color: COLORS.navy,
            }}
          >
            €{formatPriceStr(item.product.price)}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.greyMid }}>
            {item.product.priceUnit}
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <div
          className="inline-flex rounded-lg overflow-hidden"
          style={{ border: `1.5px solid ${COLORS.grey}` }}
        >
          <button
            onClick={() => onQuantityChange(item.id, -1)}
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
              onQuantityChange(item.id, newQty - item.quantity)
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
            onClick={() => onQuantityChange(item.id, 1)}
            className="w-8 h-9 flex items-center justify-center transition-all hover:bg-teal-50 hover:text-teal-700"
            style={{ background: COLORS.bg, color: COLORS.navy, fontSize: '14px', border: 'none' }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <span
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '15px',
            fontWeight: 800,
            color: COLORS.navy,
          }}
        >
          €{formatPriceStr(lineTotal)}
        </span>
      </td>
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
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
      <td style={{ padding: '14px 16px', borderBottom: idx < totalItems - 1 ? `1px solid ${COLORS.grey}` : 'none' }}>
        <div className="flex gap-1">
          <button
            onClick={() => onAddToCart(item.id)}
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
            onClick={() => onDeleteItem(item.id)}
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
}

// ============================================================================
// MOBILE CARD
// ============================================================================

interface MobileCardProps {
  item: OrderListItem
  isSelected: boolean
  onSelectItem: (id: string) => void
  onQuantityChange: (id: string, delta: number) => void
  onDeleteItem: (id: string) => void
  onAddToCart: (id: string) => void
}

function MobileCard({ item, isSelected, onSelectItem, onQuantityChange, onDeleteItem, onAddToCart }: MobileCardProps) {
  const { formatPriceStr } = usePriceMode()
  const isLowStock = item.product.stockCount <= 50
  const lineTotal = item.product.price * item.quantity

  return (
    <div
      className="p-4"
      style={{ background: isSelected ? COLORS.tealGlow : 'white' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          onClick={() => onSelectItem(item.id)}
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
            €{formatPriceStr(item.product.price)}
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
            €{formatPriceStr(lineTotal)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="inline-flex rounded-lg overflow-hidden flex-1"
          style={{ border: `1.5px solid ${COLORS.grey}` }}
        >
          <button
            onClick={() => onQuantityChange(item.id, -1)}
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
              onQuantityChange(item.id, newQty - item.quantity)
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
            onClick={() => onQuantityChange(item.id, 1)}
            className="w-10 h-9 flex items-center justify-center transition-all"
            style={{ background: COLORS.bg, color: COLORS.navy }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => onAddToCart(item.id)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ background: COLORS.teal, color: 'white' }}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeleteItem(item.id)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ background: COLORS.coralLight, color: COLORS.coral }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderListProductTable({
  items,
  selectedItems,
  showBulkBar,
  tableFilter,
  sortBy,
  onSelectItem,
  onSelectAll,
  onQuantityChange,
  onDeleteItem,
  onAddToCart,
  onDragEnd,
  onTableFilterChange,
  onSortChange,
  onBulkAction,
  onClearSelection,
}: OrderListProductTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const isAllSelected = selectedItems.size === items.length && items.length > 0
  const isSomeSelected = selectedItems.size > 0 && selectedItems.size < items.length

  return (
    <>
      {/* BULK ACTION BAR */}
      {showBulkBar && (
        <div
          className="rounded-xl p-3.5 flex items-center gap-4 mb-4 flex-wrap"
          style={{ background: COLORS.navy, color: 'white' }}
        >
          <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600 }}>
            <CheckSquare className="w-4 h-4" style={{ color: '#26A69A' }} />
            <strong style={{ color: '#26A69A' }}>{selectedItems.size}</strong> artikelen geselecteerd
          </div>
          <div className="flex gap-2 ml-auto flex-wrap">
            <button
              onClick={() => onBulkAction('add-to-cart')}
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
              onClick={() => onBulkAction('copy')}
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
              onClick={() => onBulkAction('move')}
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
              onClick={() => onBulkAction('change-qty')}
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
              onClick={() => onBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                border: `1px solid #FF6B6B`,
                background: 'rgba(255,107,107,0.1)',
                color: '#FF6B6B',
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
            onClick={onClearSelection}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}
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
                onClick={onSelectAll}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all hover:border-teal-700 ${
                  isAllSelected
                    ? 'bg-teal-700 border-teal-700'
                    : isSomeSelected
                      ? 'bg-teal-700 border-teal-700'
                      : 'border-gray-300'
                }`}
              >
                {isAllSelected ? (
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>
                ) : isSomeSelected ? (
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>–</span>
                ) : null}
              </div>
              <span
                className="cursor-pointer"
                onClick={onSelectAll}
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
                onChange={(e) => onTableFilterChange(e.target.value)}
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
              onChange={(e) => onSortChange(e.target.value)}
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
              <option value="price-low">Prijs: laag &rarr; hoog</option>
              <option value="price-high">Prijs: hoog &rarr; laag</option>
              <option value="stock">Voorraad</option>
            </select>
          </div>
        </div>

        {/* Desktop Table with DnD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
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
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {items.map((item, idx) => (
                    <SortableRow
                      key={item.id}
                      item={item}
                      idx={idx}
                      totalItems={items.length}
                      isSelected={selectedItems.has(item.id)}
                      onSelectItem={onSelectItem}
                      onQuantityChange={onQuantityChange}
                      onDeleteItem={onDeleteItem}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </div>
        </DndContext>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y" style={{ borderTop: `1px solid ${COLORS.grey}` }}>
          {items.map((item) => (
            <MobileCard
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelectItem={onSelectItem}
              onQuantityChange={onQuantityChange}
              onDeleteItem={onDeleteItem}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </>
  )
}
