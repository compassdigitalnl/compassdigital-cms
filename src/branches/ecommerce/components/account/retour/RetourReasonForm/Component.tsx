import React from 'react'
import { returnReasons } from '../types'
import type { RetourReasonFormProps } from './types'

export function RetourReasonForm({ items, onSetReason, onNext, onPrev }: RetourReasonFormProps) {
  const allHaveReason = items.every((item) => item.reason)

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <h2 className="text-base lg:text-lg font-extrabold mb-4 text-gray-900">
        Reden van retour
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-gray-200">
            <div className="text-sm font-bold text-gray-900 mb-3">{item.title} ({item.quantity}x)</div>
            <select
              value={item.reason || ''}
              onChange={(e) => onSetReason(item.id, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 bg-gray-50"
            >
              <option value="">Selecteer een reden...</option>
              {returnReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={onPrev} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-50 text-gray-900">
          Vorige
        </button>
        <button
          onClick={onNext}
          disabled={!allHaveReason}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 bg-teal-700 text-white"
        >
          Volgende
        </button>
      </div>
    </div>
  )
}
