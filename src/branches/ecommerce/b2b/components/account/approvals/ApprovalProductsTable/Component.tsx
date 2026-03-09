'use client'

import React from 'react'
import type { ApprovalProductsTableProps } from './types'

const fmt = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

export function ApprovalProductsTable({ items, totalAmount }: ApprovalProductsTableProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 lg:p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Producten ({items.length})</h3>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-50">
              <th className="text-left px-5 py-3 font-medium">Product</th>
              <th className="text-right px-5 py-3 font-medium">Prijs</th>
              <th className="text-right px-5 py-3 font-medium">Aantal</th>
              <th className="text-right px-5 py-3 font-medium">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.productName}</div>
                      {item.sku && <div className="text-xs text-gray-400">SKU: {item.sku}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600 text-right">{fmt(item.unitPrice)}</td>
                <td className="px-5 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">{fmt(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="p-4 flex items-center gap-3">
            {item.image ? (
              <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{item.productName}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.quantity}x {fmt(item.unitPrice)}</div>
            </div>
            <div className="text-sm font-bold text-gray-900">{fmt(item.totalPrice)}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-900">Totaal</span>
        <span className="text-lg font-extrabold" style={{ color: 'var(--color-primary)' }}>{fmt(totalAmount)}</span>
      </div>
    </div>
  )
}
