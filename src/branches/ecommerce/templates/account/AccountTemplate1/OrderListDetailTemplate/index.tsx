'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import {
  OrderListHeader,
  OrderListProductTable,
  OrderListSummary,
  QuickAddSearch,
} from '@/branches/ecommerce/components/account/order-lists'
import type { OrderListDetailTemplateProps } from './types'

// Dynamic import to avoid SSR issues with camera access
const BarcodeScanner = dynamic(
  () => import('@/branches/ecommerce/components/account/order-lists/BarcodeScanner/Component'),
  { ssr: false },
)

export default function OrderListDetailTemplate({
  list,
  selectedItems,
  showBulkBar,
  tableFilter,
  sortBy,
  quickAddQuery,
  quickAddFocused,
  quickAddResults,
  quickAddLoading,
  showBarcodeScanner,
  filteredItems,
  stats,
  discount,
  expectedTotal,
  onSelectItem,
  onSelectAll,
  onQuantityChange,
  onDeleteItem,
  onAddToCart,
  onAddAllToCart,
  onBulkAction,
  onClearSelection,
  onDragEnd,
  onTableFilterChange,
  onSortChange,
  onQuickAddQueryChange,
  onQuickAddFocus,
  onQuickAddBlur,
  onAddProductToList,
  onScanBarcode,
  onBarcodeScan,
  onCloseBarcodeScanner,
  onShare,
  onDuplicate,
  onExport,
  onPrint,
  onNotesChange,
  onRequestQuote,
  notesValue,
}: OrderListDetailTemplateProps) {
  return (
    <div>
      {/* Header: list info, stats, actions */}
      <OrderListHeader
        list={list}
        stats={stats}
        onAddAllToCart={onAddAllToCart}
        onShare={onShare}
        onDuplicate={onDuplicate}
        onExport={onExport}
        onPrint={onPrint}
      />

      {/* Quick Add: search / barcode input */}
      <QuickAddSearch
        query={quickAddQuery}
        focused={quickAddFocused}
        results={quickAddResults}
        loading={quickAddLoading}
        onQueryChange={onQuickAddQueryChange}
        onFocus={onQuickAddFocus}
        onBlur={onQuickAddBlur}
        onAddProduct={onAddProductToList}
        onScanBarcode={onScanBarcode}
      />

      {/* Product table: bulk bar + sortable desktop table + mobile cards */}
      <OrderListProductTable
        items={filteredItems}
        selectedItems={selectedItems}
        showBulkBar={showBulkBar}
        tableFilter={tableFilter}
        sortBy={sortBy}
        onSelectItem={onSelectItem}
        onSelectAll={onSelectAll}
        onQuantityChange={onQuantityChange}
        onDeleteItem={onDeleteItem}
        onAddToCart={onAddToCart}
        onDragEnd={onDragEnd}
        onTableFilterChange={onTableFilterChange}
        onSortChange={onSortChange}
        onBulkAction={onBulkAction}
        onClearSelection={onClearSelection}
      />

      {/* Summary: totals + notes */}
      <OrderListSummary
        itemCount={list.items.length}
        totalValue={stats.totalValue}
        discount={discount}
        expectedTotal={expectedTotal}
        notes={notesValue}
        onAddAllToCart={onAddAllToCart}
        onRequestQuote={onRequestQuote}
        onNotesChange={onNotesChange}
      />

      {/* Barcode scanner modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={onBarcodeScan}
          onClose={onCloseBarcodeScanner}
        />
      )}
    </div>
  )
}
