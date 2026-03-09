import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { OrderListsWidgetProps } from './types'

export function OrderListsWidget({ orderLists }: OrderListsWidgetProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 lg:mb-5">
        <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Bestellijsten</h2>
        <Link
          href="/account/lists"
          className="flex items-center gap-1 lg:gap-2 text-sm font-semibold transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          <span className="hidden lg:inline">Alle lijsten</span>
          <span className="lg:hidden">Alle</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {orderLists.length > 0 ? (
        <div className="space-y-3">
          {orderLists.slice(0, 2).map((list: any) => (
            <Link
              key={list.id}
              href={`/account/lists/${list.id}`}
              className="block p-3 lg:p-4 rounded-xl transition-all active:scale-95 lg:hover:scale-[1.01]"
              style={{ border: '1.5px solid var(--color-border)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{list.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {list.items?.length || 0} producten
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <Link
            href="/account/lists"
            className="block p-3 lg:p-4 rounded-xl text-center transition-all active:bg-gray-50 lg:hover:bg-gray-50"
            style={{ border: '1.5px dashed var(--color-border)' }}
          >
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-primary)' }}>
              + Nieuwe bestellijst
            </div>
            <div className="text-xs text-gray-500">Maak een lijst voor herhaalbestellingen</div>
          </Link>
        </div>
      ) : (
        <Link
          href="/account/lists"
          className="block p-3 lg:p-4 rounded-xl text-center transition-all active:bg-gray-50 lg:hover:bg-gray-50"
          style={{ border: '1.5px dashed var(--color-border)' }}
        >
          <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-primary)' }}>
            + Nieuwe bestellijst
          </div>
          <div className="text-xs text-gray-500">Maak een lijst voor herhaalbestellingen</div>
        </Link>
      )}
    </div>
  )
}
