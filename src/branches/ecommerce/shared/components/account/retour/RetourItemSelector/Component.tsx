import React from 'react'
import { CheckCircle2, Package } from 'lucide-react'
import type { RetourItemSelectorProps } from './types'

export function RetourItemSelector({ items, onToggleItem, onSetQuantity, onNext, selectedCount }: RetourItemSelectorProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <h2 className="text-base lg:text-lg font-extrabold mb-4 text-navy">
        Selecteer producten om te retourneren
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              item.selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]' : 'border-grey-light'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              item.selected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-grey-light'
            }`}>
              {item.selected && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <div className="w-10 h-10 rounded-lg bg-grey-light flex items-center justify-center">
              <Package className="w-5 h-5 text-grey-mid" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-navy">{item.title}</div>
              {item.sku && <div className="text-xs font-mono text-grey-mid">{item.sku}</div>}
            </div>
            {item.selected && (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <label className="text-xs text-grey-mid">Aantal:</label>
                <input
                  type="number"
                  min={1}
                  max={item.maxQuantity}
                  value={item.quantity}
                  onChange={(e) => onSetQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 rounded-lg border border-grey-light text-sm text-center"
                />
                <span className="text-xs text-grey-mid">/ {item.maxQuantity}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className="btn btn-primary"
        >
          Volgende
        </button>
      </div>
    </div>
  )
}
